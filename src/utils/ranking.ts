/**
 * Utility Functions for Warrior Ranking System
 * File: src/utils/ranking.ts
 */

import {
  RankTier,
  AchievementBadge,
  TIER_CONFIG,
  BADGE_CONFIG,
  POINT_WEIGHTS,
} from '@/types/leaderboard';

/**
 * Determine rank tier based on total points
 */
export function determineTier(totalPoints: number): RankTier {
  if (totalPoints <= 500) return RankTier.RECRUIT;
  if (totalPoints <= 1500) return RankTier.ELITE_WARRIOR;
  if (totalPoints <= 3000) return RankTier.COMMANDER;
  return RankTier.LEGENDARY_MENTOR;
}

/**
 * Get tier configuration
 */
export function getTierConfig(tier: RankTier) {
  return TIER_CONFIG[tier];
}

/**
 * Format points with thousand separator
 */
export function formatPoints(points: number): string {
  return points.toLocaleString('id-ID');
}

/**
 * Get tier label and icon
 */
export function getTierLabel(tier: RankTier): { label: string; emoji: string; color: string } {
  const config = TIER_CONFIG[tier];
  return {
    label: config.label,
    emoji: config.emoji,
    color: config.color,
  };
}

/**
 * Calculate weekly points from component sources
 * Formula: (Quiz × 0.40) + (Consistency × 0.35) + (Community × 0.25)
 */
export function calculateWeeklyPoints(
  quizPoints: number,
  consistencyPoints: number,
  communityPoints: number
): number {
  const quiz = Math.min(quizPoints, 100); // Max 100 points
  const consistency = Math.min(consistencyPoints, 35); // Max 35 points
  const community = Math.min(communityPoints, 20); // Max 20 points

  const total =
    quiz * POINT_WEIGHTS.QUIZ +
    consistency * POINT_WEIGHTS.CONSISTENCY +
    community * POINT_WEIGHTS.COMMUNITY;

  return Math.round(total);
}

/**
 * Calculate quiz points based on module completion
 * Returns weighted quiz score contribution
 */
export function calculateQuizPointsContribution(
  modulesCompleted: number,
  averageScore: number
): number {
  // Max 40 points for quiz (40% weight)
  const maxPoints = 40;
  if (modulesCompleted === 0) return 0;

  // Average score (0-100) gets converted to 0-100 points, then weighted to 40
  const contribution = (averageScore / 100) * 100 * POINT_WEIGHTS.QUIZ;
  return Math.min(contribution, maxPoints);
}

/**
 * Calculate consistency points from journal entries
 * 5 points per unique day (max 7 days per week)
 */
export function calculateConsistencyPointsContribution(entriesThisWeek: number): number {
  // Max 35 points for consistency (35% weight)
  const daysCount = Math.min(entriesThisWeek, 7);
  const points = daysCount * 5; // 5 points per day
  return Math.min(points, 35);
}

/**
 * Calculate community points from discussion comments
 * 2 points per meaningful comment (max 10 per week)
 */
export function calculateCommunityPointsContribution(commentsThisWeek: number): number {
  // Max 20 points for community (25% weight)
  const commentCount = Math.min(commentsThisWeek, 10);
  const points = commentCount * 2; // 2 points per comment
  return Math.min(points, 20);
}

/**
 * Format trend indicator
 */
export function formatRankTrend(rankChange: number): { icon: string; text: string } {
  if (rankChange < 0) {
    return { icon: '↑', text: `Improved by ${Math.abs(rankChange)}` };
  } else if (rankChange > 0) {
    return { icon: '↓', text: `Declined by ${rankChange}` };
  } else {
    return { icon: '→', text: 'No change' };
  }
}

/**
 * Get achievement badge emoji and label
 */
export function getBadgeInfo(badge: AchievementBadge) {
  return BADGE_CONFIG[badge];
}

/**
 * Check if user qualifies for Consistency King badge
 * Requirement: 30+ consecutive days with journal entry
 */
export function qualifiesForConsistencyKing(consecutiveDays: number): boolean {
  return consecutiveDays >= 30;
}

/**
 * Check if user qualifies for Knowledge Master badge
 * Requirement: Completed all modules with average ≥80%
 */
export function qualifiesForKnowledgeMaster(
  modulesCompleted: number,
  totalModules: number,
  averageScore: number
): boolean {
  return modulesCompleted === totalModules && averageScore >= 80;
}

/**
 * Check if user qualifies for Community Champion badge
 * Requirement: 100+ meaningful comments
 */
export function qualifiesForCommunityChampion(allTimeComments: number): boolean {
  return allTimeComments >= 100;
}

/**
 * Check if user qualifies for Top Performer badge
 * Requirement: Rank #1-3 for 2+ consecutive weeks
 */
export function qualifiesForTopPerformer(
  rankHistoryData: { rank: number; date: string }[],
  weeksRequired: number = 2
): boolean {
  if (rankHistoryData.length < weeksRequired * 7) return false;

  let consecutiveWeeks = 0;
  let currentWeek = 0;

  // Sort by date descending (most recent first)
  const sorted = [...rankHistoryData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  for (let i = 0; i < sorted.length; i++) {
    const entry = sorted[i];
    const weekOfEntry = Math.floor(i / 7);

    if (entry.rank <= 3) {
      if (weekOfEntry !== currentWeek) {
        consecutiveWeeks++;
        currentWeek = weekOfEntry;
      }
    } else {
      consecutiveWeeks = 0;
      currentWeek = weekOfEntry + 1;
    }

    if (consecutiveWeeks >= weeksRequired) return true;
  }

  return false;
}

/**
 * Check if user qualifies for Comeback Warrior badge
 * Requirement: Rose 20+ positions within 1 week
 */
export function qualifiesForComebackWarrior(
  rankHistoryData: { rank: number; date: string }[],
  positionsRequired: number = 20,
  daysRequired: number = 7
): boolean {
  if (rankHistoryData.length < 2) return false;

  const sorted = [...rankHistoryData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const cutoffDate = new Date(sorted[sorted.length - 1].date);
  cutoffDate.setDate(cutoffDate.getDate() - daysRequired);

  const recentHistory = sorted.filter(entry => new Date(entry.date) >= cutoffDate);

  if (recentHistory.length < 2) return false;

  const oldestRank = recentHistory[0].rank;
  const newestRank = recentHistory[recentHistory.length - 1].rank;

  return oldestRank - newestRank >= positionsRequired;
}

/**
 * Get medal emoji for rank
 */
export function getRankMedalEmoji(rank: number): string {
  if (rank === 1) return '👑';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `#${rank}`;
}

/**
 * Get tier color CSS class (Tailwind)
 */
export function getTierColorClass(tier: RankTier): string {
  const colorMap: Record<RankTier, string> = {
    [RankTier.RECRUIT]: 'text-gray-600',
    [RankTier.ELITE_WARRIOR]: 'text-blue-600',
    [RankTier.COMMANDER]: 'text-yellow-600',
    [RankTier.LEGENDARY_MENTOR]: 'text-purple-600',
  };
  return colorMap[tier];
}

/**
 * Get tier background CSS class (Tailwind)
 */
export function getTierBgClass(tier: RankTier): string {
  const bgMap: Record<RankTier, string> = {
    [RankTier.RECRUIT]: 'bg-gray-100',
    [RankTier.ELITE_WARRIOR]: 'bg-blue-100',
    [RankTier.COMMANDER]: 'bg-yellow-100',
    [RankTier.LEGENDARY_MENTOR]: 'bg-purple-100',
  };
  return bgMap[tier];
}

/**
 * Calculate percentile rank
 * Example: If user is rank 42 out of 1000, percentile = 95.8%
 */
export function calculatePercentileRank(currentRank: number, totalUsers: number): number {
  return Math.round(((totalUsers - currentRank) / totalUsers) * 100 * 10) / 10;
}

/**
 * Format win rate as percentage
 */
export function formatWinRate(winRate: number): string {
  return `${Math.round(winRate)}%`;
}

/**
 * Get all badges that user has earned
 */
export function getAllBadgesEmoji(badges: AchievementBadge[]): string {
  return badges.map(badge => BADGE_CONFIG[badge].icon).join(' ');
}

/**
 * Get badge tooltip text
 */
export function getBadgeTooltip(badges: AchievementBadge[]): string {
  return badges.map(badge => BADGE_CONFIG[badge].label).join(', ') || 'No badges earned yet';
}

/**
 * Sort leaderboard entries by column
 */
export function sortLeaderboard(
  entries: any[],
  sortBy: 'rank' | 'points' | 'winRate' | 'tier' = 'rank',
  sortOrder: 'asc' | 'desc' = 'asc'
) {
  const sorted = [...entries];

  sorted.sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'rank':
        aValue = a.rank;
        bValue = b.rank;
        break;
      case 'points':
        aValue = a.totalPoints;
        bValue = b.totalPoints;
        break;
      case 'winRate':
        aValue = a.winRate;
        bValue = b.winRate;
        break;
      case 'tier':
        aValue = getTierConfig(a.tier).minPoints;
        bValue = getTierConfig(b.tier).minPoints;
        break;
      default:
        return 0;
    }

    if (sortOrder === 'asc') {
      return aValue - bValue;
    } else {
      return bValue - aValue;
    }
  });

  return sorted;
}

/**
 * Validate point values
 */
export function validatePointBreakdown(quizPoints: number, consistencyPoints: number, communityPoints: number) {
  return {
    valid: quizPoints >= 0 && quizPoints <= 100 && consistencyPoints >= 0 && consistencyPoints <= 35 && communityPoints >= 0 && communityPoints <= 20,
    quiz: Math.min(Math.max(quizPoints, 0), 100),
    consistency: Math.min(Math.max(consistencyPoints, 0), 35),
    community: Math.min(Math.max(communityPoints, 0), 20),
  };
}

/**
 * Get time until next rank up calculation
 */
export function pointsUntilNextRank(currentPoints: number, currentTier: RankTier): number {
  const nextTier = (() => {
    switch (currentTier) {
      case RankTier.RECRUIT:
        return 501 - currentPoints;
      case RankTier.ELITE_WARRIOR:
        return 1501 - currentPoints;
      case RankTier.COMMANDER:
        return 3001 - currentPoints;
      case RankTier.LEGENDARY_MENTOR:
        return 0; // Already at max
      default:
        return 0;
    }
  })();

  return Math.max(nextTier, 0);
}
