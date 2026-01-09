/**
 * Leaderboard Database Service
 * File: src/lib/db/leaderboard-service.ts
 * 
 * This service handles all leaderboard operations:
 * - Calculate points and rankings
 * - Manage badges and tiers
 * - Cache management
 * - Real-time updates
 */

import { Container, CosmosClient } from '@azure/cosmos';
import {
  LeaderboardEntry,
  LeaderboardFilter,
  LeaderboardResponse,
  RecalculateRankingRequest,
  RecalculateRankingResponse,
  RankTier,
  AchievementBadge,
  TopThreeEntry,
  UserRankingDetail,
  PointLog,
  RankHistory,
} from '@/types/leaderboard';
import { determineTier, calculateWeeklyPoints, calculatePercentileRank } from '@/utils/ranking';

// Cache layer (Redis or in-memory for development)
interface CacheEntry {
  data: any;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Initialize Cosmos DB client
let cosmosClient: CosmosClient | null = null;
let leaderboardContainer: Container | null = null;

async function initializeCosmosDB() {
  if (!cosmosClient) {
    cosmosClient = new CosmosClient({
      endpoint: process.env.AZURE_COSMOS_ENDPOINT!,
      key: process.env.AZURE_COSMOS_KEY!,
    });

    const database = cosmosClient.database(process.env.AZURE_COSMOS_DATABASE!);
    leaderboardContainer = database.container('users'); // Reuse existing users container
  }
  return leaderboardContainer;
}

// ==================== CACHE UTILITIES ====================

function getCacheKey(prefix: string, params: any = {}): string {
  const paramStr = Object.entries(params)
    .map(([k, v]) => `${k}:${v}`)
    .join('|');
  return `${prefix}${paramStr ? '|' + paramStr : ''}`;
}

function getFromCache<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;

  if (entry.expiresAt < Date.now()) {
    cache.delete(key);
    return null;
  }

  return entry.data as T;
}

function setCache<T>(key: string, data: T, ttl: number = CACHE_TTL): T {
  cache.set(key, {
    data,
    expiresAt: Date.now() + ttl,
  });
  return data;
}

function invalidateCache(pattern: string): void {
  const regex = new RegExp(pattern);
  for (const key of cache.keys()) {
    if (regex.test(key)) {
      cache.delete(key);
    }
  }
}

// ==================== POINT CALCULATIONS ====================

/**
 * Calculate total points for a user from all sources
 */
export async function calculateTotalPoints(userId: string): Promise<number> {
  try {
    const container = await initializeCosmosDB();
    const { resource: user } = await container!.item(userId, userId).read();

    if (!user) return 0;

    // Sum of all points from different sources
    const totalPoints =
      (user.pointsBreakdown?.quizPoints || 0) +
      (user.pointsBreakdown?.consistencyPoints || 0) +
      (user.pointsBreakdown?.communityPoints || 0);

    return totalPoints;
  } catch (error) {
    console.error('Error calculating total points:', error);
    return 0;
  }
}

/**
 * Recalculate user's points and ranking
 * Called after: quiz completion, journal entry, comment posting
 */
export async function recalculateUserRanking(
  request: RecalculateRankingRequest
): Promise<RecalculateRankingResponse> {
  try {
    const container = await initializeCosmosDB();
    const { resource: user } = await container!.item(request.userId, request.userId).read();

    if (!user) {
      throw new Error(`User ${request.userId} not found`);
    }

    // Store previous state
    const previousRank = user.currentRank || 999999;
    const previousTotal = user.totalPoints || 0;
    const previousTier = determineTier(previousTotal);

    // Calculate new points based on action
    let newQuizPoints = user.pointsBreakdown?.quizPoints || 0;
    let newConsistencyPoints = user.pointsBreakdown?.consistencyPoints || 0;
    let newCommunityPoints = user.pointsBreakdown?.communityPoints || 0;

    switch (request.action) {
      case 'QUIZ_COMPLETED':
        // Quiz points are managed separately by education service
        // Just trigger recalculation here
        break;

      case 'JOURNAL_ENTRY':
        // Update consistency points
        newConsistencyPoints = calculateConsistencyPointsFromJournal(user.journalEntries || []);
        break;

      case 'COMMENT_ADDED':
        // Update community points
        newCommunityPoints = calculateCommunityPointsFromComments(user.commentStats || { thisWeek: 0 });
        break;

      case 'ADMIN_OVERRIDE':
        if (request.pointsAdjustment !== undefined) {
          newQuizPoints += request.pointsAdjustment;
        }
        break;
    }

    // Calculate new total points
    const newTotal = Math.max(0, newQuizPoints + newConsistencyPoints + newCommunityPoints);

    // Determine new tier
    const newTier = determineTier(newTotal);

    // Calculate new rank (query all users)
    const newRank = await calculateUserRank(request.userId, newTotal);

    // Check for badges
    const newBadges = await calculateUserBadges(request.userId);

    // Log the change
    await logPointChange({
      userId: request.userId,
      action: request.action,
      pointsAdded: newTotal - previousTotal,
      previousTotal,
      newTotal,
      previousRank,
      newRank,
      previousTier,
      newTier,
      details: {
        quizId: request.actionId,
        adminNote: request.reason,
      },
    });

    // Update user document
    await container!.item(request.userId, request.userId).patch([
      { op: 'set', path: '/totalPoints', value: newTotal },
      { op: 'set', path: '/currentRank', value: newRank },
      { op: 'set', path: '/previousRank', value: previousRank },
      { op: 'set', path: '/rankChange', value: newRank - previousRank },
      { op: 'set', path: '/tier', value: newTier },
      { op: 'set', path: '/badges', value: newBadges },
      { op: 'set', path: '/pointsBreakdown', value: { quizPoints: newQuizPoints, consistencyPoints: newConsistencyPoints, communityPoints: newCommunityPoints } },
      { op: 'set', path: '/lastRankUpdate', value: new Date().toISOString() },
    ]);

    // Invalidate caches
    invalidateCache('leaderboard:');
    invalidateCache(`user:${request.userId}:ranking`);

    return {
      success: true,
      userId: request.userId,
      previousRank,
      newRank,
      pointsChange: newTotal - previousTotal,
      totalPointsChange: newTotal - previousTotal,
      previousTotal,
      newTotal,
      previousTier,
      newTier,
      tierChanged: previousTier !== newTier,
      badgesEarned: newBadges.filter(badge => !user.badges?.includes(badge)) || [],
      badgesLost: (user.badges || []).filter((badge: string) => !newBadges.includes(badge as AchievementBadge)) || [],
      achievedTopTen: newRank <= 10,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error recalculating user ranking:', error);
    throw error;
  }
}

/**
 * Calculate user's current rank position
 */
export async function calculateUserRank(userId: string, userPoints?: number): Promise<number> {
  try {
    const container = await initializeCosmosDB();

    // Get user's total points if not provided
    let totalPoints = userPoints;
    if (totalPoints === undefined) {
      const { resource: user } = await container!.item(userId, userId).read();
      totalPoints = user?.totalPoints || 0;
    }

    // Count users with more points
    const { resources: allUsers } = await container!.items
      .query<{ totalPoints: number }>('SELECT c.totalPoints FROM c WHERE c.totalPoints IS NOT NULL')
      .fetchAll();

    const usersWithMorePoints = allUsers.filter(u => u.totalPoints > (totalPoints || 0)).length;
    return usersWithMorePoints + 1; // Rank is position
  } catch (error) {
    console.error('Error calculating user rank:', error);
    return 999999; // Default to bottom if error
  }
}

// ==================== LEADERBOARD RETRIEVAL ====================

/**
 * Get leaderboard with filtering and pagination
 */
export async function getLeaderboard(
  filter: LeaderboardFilter,
  currentUserId?: string
): Promise<LeaderboardResponse> {
  try {
    const cacheKey = getCacheKey('leaderboard:', { ...filter, currentUserId });
    const cached = getFromCache<LeaderboardResponse>(cacheKey);
    if (cached) return cached;

    const container = await initializeCosmosDB();

    // Build query
    const limit = Math.min(filter.limit || 100, 100); // Max 100
    const offset = filter.offset || 0;

    let query = 'SELECT c.userId, c.displayName, c.profileImage, c.email, c.totalPoints, c.currentRank, c.previousRank, c.tier, c.badges FROM c WHERE c.totalPoints IS NOT NULL ORDER BY c.totalPoints DESC';

    // Add search filter if provided
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      query = query.replace('WHERE', `WHERE CONTAINS(LOWER(c.displayName), "${searchLower}") AND`);
    }

    const { resources: users } = await container!.items.query(query).fetchAll();

    // Apply offset and limit in memory for now
    const paginatedUsers = users.slice(offset, offset + limit);

    // Transform to leaderboard entries
    const entries: LeaderboardEntry[] = paginatedUsers.map((user: any, index: number) => ({
      userId: user.userId,
      rank: offset + index + 1,
      userName: user.displayName || user.email?.split('@')[0],
      avatar: user.profileImage,
      tier: user.tier || determineTier(user.totalPoints),
      totalPoints: user.totalPoints,
      badges: user.badges || [],
      winRate: user.winRate || 0,
      rankChange: (user.currentRank || 0) - (user.previousRank || 0),
      isCurrentUser: user.userId === currentUserId,
      pointsBreakdown: {
        quizPoints: 0,
        consistencyPoints: 0,
        communityPoints: 0,
      },
    }));

    const response: LeaderboardResponse = {
      data: entries,
      metadata: {
        total: users.length,
        period: filter.period,
        lastUpdated: new Date().toISOString(),
        generatedAt: new Date().toISOString(),
        hasMore: offset + limit < users.length,
        offset,
        limit,
      },
    };

    return setCache(cacheKey, response, CACHE_TTL);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
}

/**
 * Get top 3 users for dashboard widget
 */
export async function getTopThree(): Promise<TopThreeEntry[]> {
  try {
    const cacheKey = 'leaderboard:top_three';
    const cached = getFromCache<TopThreeEntry[]>(cacheKey);
    if (cached) return cached;

    const response = await getLeaderboard({ period: 'ALL_TIME', limit: 3 }, undefined);
    const topThree = response.data.slice(0, 3).map((entry, idx) => ({
      rank: (idx + 1) as 1 | 2 | 3,
      userId: entry.userId,
      userName: entry.userName,
      avatar: entry.avatar || '/default-avatar.png',
      tier: entry.tier,
      totalPoints: entry.totalPoints,
    }));

    return setCache(cacheKey, topThree, CACHE_TTL);
  } catch (error) {
    console.error('Error fetching top three:', error);
    throw error;
  }
}

/**
 * Get detailed ranking info for a specific user
 */
export async function getUserRankingDetail(userId: string): Promise<UserRankingDetail> {
  try {
    const cacheKey = `user:${userId}:ranking`;
    const cached = getFromCache<UserRankingDetail>(cacheKey);
    if (cached) return cached;

    const container = await initializeCosmosDB();
    const { resource: user } = await container!.item(userId, userId).read();

    if (!user) {
      throw new Error(`User ${userId} not found`);
    }

    // Get percentile
    const allUsersCount = await getTotalUserCount();
    const percentile = calculatePercentileRank(user.currentRank || 1, allUsersCount);

    const detail: UserRankingDetail = {
      userId: user.userId,
      userName: user.name,
      tier: user.tier || determineTier(user.totalPoints || 0),
      currentRank: user.currentRank || 999999,
      previousRank: user.previousRank || user.currentRank || 999999,
      totalPoints: user.totalPoints || 0,
      weeklyPoints: user.weeklyPoints || 0,
      monthlyPoints: user.monthlyPoints || 0,
      pointsBreakdown: {
        quizPoints: user.pointsBreakdown?.quizPoints || 0,
        consistencyPoints: user.pointsBreakdown?.consistencyPoints || 0,
        communityPoints: user.pointsBreakdown?.communityPoints || 0,
      },
      badges: user.badges || [],
      winRate: user.tradingStats?.winRate || 0,
      journalStats: {
        entriesThisWeek: user.journalEntries?.entriesThisWeek || 0,
        consecutiveDays: user.journalEntries?.consecutiveDays || 0,
        allTimeDays: user.journalEntries?.allTimeDays || 0,
      },
      quizStats: {
        modulesCompleted: user.quizStats?.modulesCompleted || 0,
        averageScore: user.quizStats?.averageScore || 0,
        highestScore: user.quizStats?.highestScore || 0,
        lowestScore: user.quizStats?.lowestScore || 0,
      },
      commentStats: {
        thisWeek: user.commentStats?.thisWeek || 0,
        thisMonth: user.commentStats?.thisMonth || 0,
        allTime: user.commentStats?.allTime || 0,
      },
      percentileRank: percentile,
    };

    return setCache(cacheKey, detail, CACHE_TTL);
  } catch (error) {
    console.error('Error fetching user ranking detail:', error);
    throw error;
  }
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Calculate consistency points from journal entries
 */
function calculateConsistencyPointsFromJournal(journalEntries: any): number {
  const entries = journalEntries?.entriesThisWeek || 0;
  const daysCount = Math.min(entries, 7);
  return daysCount * 5; // 5 points per day, max 35
}

/**
 * Calculate community points from comments
 */
function calculateCommunityPointsFromComments(commentStats: any): number {
  const comments = commentStats?.thisWeek || 0;
  const commentCount = Math.min(comments, 10);
  return commentCount * 2; // 2 points per comment, max 20
}

/**
 * Calculate user's badges
 */
async function calculateUserBadges(userId: string): Promise<AchievementBadge[]> {
  try {
    const container = await initializeCosmosDB();
    const { resource: user } = await container!.item(userId, userId).read();

    const badges: AchievementBadge[] = [];

    // Check each badge criteria
    if (user.journalEntries?.consecutiveDays >= 30) {
      badges.push(AchievementBadge.CONSISTENCY_KING);
    }

    // Add more badge checks here...

    return badges;
  } catch (error) {
    console.error('Error calculating badges:', error);
    return [];
  }
}

/**
 * Log point change for audit trail
 */
async function logPointChange(logData: Partial<PointLog>): Promise<void> {
  try {
    // For now, just log to console
    // In production, you would save this to point_logs collection
    console.log('📊 Point log:', logData);
    // TODO: Implement proper logging to Cosmos DB
  } catch (error) {
    console.error('Error logging point change:', error);
    // Don't throw - logging should not fail the main operation
  }
}

/**
 * Get total user count
 */
async function getTotalUserCount(): Promise<number> {
  try {
    const container = await initializeCosmosDB();
    const query = 'SELECT VALUE COUNT(1) FROM c WHERE c.totalPoints IS NOT NULL';
    const { resources } = await container!.items.query<number>(query).fetchAll();
    return resources[0] || 0;
  } catch (error) {
    console.error('Error getting total user count:', error);
    return 1;
  }
}

// ==================== BATCH OPERATIONS ====================

/**
 * Batch recalculate all users' rankings
 * Called by daily cron job
 */
export async function batchRecalculateAllRankings(dryRun: boolean = false): Promise<{ processed: number; updated: number }> {
  try {
    const container = await initializeCosmosDB();
    const query = 'SELECT c.userId FROM c WHERE c.totalPoints IS NOT NULL';
    const { resources: users } = await container!.items.query(query).fetchAll();

    let updated = 0;

    for (const user of users) {
      try {
        if (!dryRun) {
          await recalculateUserRanking({
            userId: user.userId,
            action: 'ADMIN_OVERRIDE',
            reason: 'Batch recalculation',
          });
        }
        updated++;
      } catch (error) {
        console.error(`Error processing user ${user.userId}:`, error);
      }
    }

    invalidateCache('leaderboard:');

    return { processed: users.length, updated };
  } catch (error) {
    console.error('Error in batch recalculation:', error);
    throw error;
  }
}

export { invalidateCache };
