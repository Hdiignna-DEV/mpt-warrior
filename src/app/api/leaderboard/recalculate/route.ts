/**
 * API Route: /api/leaderboard/recalculate
 * POST - Trigger ranking recalculation (Super Admin only)
 * Optional body: { userId?: string, batchMode?: boolean }
 * - userId: recalculate single user
 * - batchMode: recalculate all users (full rebuild)
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getCosmosClient } from '@/lib/db/cosmos-client';
import { 
  determineTier,
  calculateWeeklyPoints,
  calculateQuizPointsContribution,
  calculateConsistencyPointsContribution,
  calculateCommunityPointsContribution,
  sortLeaderboard,
} from '@/utils/ranking';
import { deleteCachedValue } from '@/lib/cache/redis-cache';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(request);
    if (!decoded || decoded.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Only super admins can recalculate rankings' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId, batchMode } = body;

    const database = getCosmosClient().database('mpt-warrior');
    const usersContainer = database.container('users');
    const pointLogsContainer = database.container('point_logs');

    if (batchMode) {
      // ==================== Batch Recalculation ====================
      console.log('🔄 Starting batch ranking recalculation...');

      const { resources: allUsers } = await usersContainer.items
        .query<any>('SELECT * FROM c WHERE c.role = "WARRIOR"')
        .fetchAll();

      let updated = 0;
      let failed = 0;

      for (const user of allUsers) {
        try {
          await recalculateUserRanking(
            user.id,
            user,
            usersContainer,
            pointLogsContainer
          );
          updated++;
        } catch (error) {
          console.error(`Failed to update ${user.id}:`, error);
          failed++;
        }
      }

      // Update rankings based on points
      const { resources: rankedUsers } = await usersContainer.items
        .query<any>(
          'SELECT c.id, c.totalPoints FROM c WHERE c.role = "WARRIOR" ORDER BY c.totalPoints DESC'
        )
        .fetchAll();

      for (let i = 0; i < rankedUsers.length; i++) {
        const user = rankedUsers[i];
        const { resource: userDoc } = await usersContainer.item(user.id, user.id).read<any>();
        
        const newRank = i + 1;
        const rankChange = (userDoc.currentRank || 999999) - newRank;

        userDoc.currentRank = newRank;
        userDoc.previousRank = userDoc.currentRank || newRank;
        userDoc.rankChange = rankChange;
        userDoc.lastRankUpdate = new Date().toISOString();

        await usersContainer.item(user.id, user.id).replace(userDoc);
      }

      // Clear cache
      await deleteCachedValue('leaderboard:top100:v1');
      await deleteCachedValue('leaderboard:top3:v1');

      console.log(`✅ Batch recalculation complete: ${updated} updated, ${failed} failed`);

      return NextResponse.json({
        success: true,
        message: `Batch recalculation complete: ${updated} updated, ${failed} failed`,
        updated,
        failed,
        total: allUsers.length,
      });
    } else if (userId) {
      // ==================== Single User Recalculation ====================
      console.log(`🔄 Recalculating ranking for user ${userId}...`);

      const { resource: user } = await usersContainer.item(userId, userId).read<any>();
      
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      await recalculateUserRanking(
        userId,
        user,
        usersContainer,
        pointLogsContainer
      );

      // Get new rank
      const { resources: rankedUsers } = await usersContainer.items
        .query<any>(
          'SELECT c.id, c.totalPoints FROM c WHERE c.role = "WARRIOR" ORDER BY c.totalPoints DESC'
        )
        .fetchAll();

      const newRankIndex = rankedUsers.findIndex(u => u.id === userId);
      const newRank = newRankIndex + 1;

      const { resource: updatedUser } = await usersContainer.item(userId, userId).read<any>();
      const rankChange = (updatedUser.previousRank || 999999) - newRank;

      updatedUser.currentRank = newRank;
      updatedUser.rankChange = rankChange;
      updatedUser.lastRankUpdate = new Date().toISOString();

      await usersContainer.item(userId, userId).replace(updatedUser);

      // Clear cache
      await deleteCachedValue('leaderboard:top100:v1');
      await deleteCachedValue('leaderboard:top3:v1');
      await deleteCachedValue(`user:ranking:${userId}`);

      console.log(`✅ User ${userId} recalculated: rank ${newRank}, change ${rankChange}`);

      return NextResponse.json({
        success: true,
        message: `User ranking recalculated`,
        userId,
        newRank,
        rankChange,
        totalPoints: updatedUser.totalPoints,
      });
    } else {
      return NextResponse.json(
        { error: 'Must provide either userId or set batchMode=true' },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error('Error recalculating rankings:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to recalculate rankings' },
      { status: 500 }
    );
  }
}

async function recalculateUserRanking(
  userId: string,
  user: any,
  usersContainer: any,
  pointLogsContainer: any
) {
  // Calculate quiz points contribution
  const modulesCompleted = user.quizStats?.modulesCompleted || 0;
  const avgScore = user.quizStats?.averageScore || 0;
  const quizPoints = calculateQuizPointsContribution(modulesCompleted, avgScore);

  // Calculate consistency points contribution
  const journalEntriesThisWeek = user.journalEntries?.entriesThisWeek || 0;
  const consistencyPoints = calculateConsistencyPointsContribution(journalEntriesThisWeek);

  // Calculate community points contribution
  const commentsThisWeek = user.commentStats?.thisWeek || 0;
  const communityPoints = calculateCommunityPointsContribution(commentsThisWeek);

  // Calculate total weekly points
  const weeklyPoints = calculateWeeklyPoints(quizPoints, consistencyPoints, communityPoints);

  // Update user's points and tier
  user.weeklyPoints = weeklyPoints;
  user.pointsBreakdown = {
    quizPoints,
    consistencyPoints,
    communityPoints,
  };

  // Calculate total points (could be cumulative or just weekly depending on spec)
  // For now, we'll assume totalPoints includes historical data
  // Adjust logic based on actual requirements
  user.totalPoints = (user.totalPoints || 0) + weeklyPoints;
  user.tier = determineTier(user.totalPoints);

  await usersContainer.item(userId, userId).replace(user);

  // Log the point change
  await pointLogsContainer.items.create({
    userId,
    action: 'RECALCULATION',
    previousPoints: user.totalPoints - weeklyPoints,
    newPoints: user.totalPoints,
    weeklyPoints,
    breakdown: user.pointsBreakdown,
    timestamp: new Date().toISOString(),
    source: 'BATCH_RECALCULATION',
  });
}
