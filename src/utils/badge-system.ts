/**
 * Badge & Ranking System Utilities
 * File: src/utils/badge-system.ts
 * 
 * Comprehensive badge calculation and display system for the Warrior Ranking
 */

export enum RankTier {
  RECRUIT = 'RECRUIT',
  ELITE_WARRIOR = 'ELITE_WARRIOR',
  COMMANDER = 'COMMANDER',
  LEGENDARY_MENTOR = 'LEGENDARY_MENTOR',
}

export interface BadgeInfo {
  tier: RankTier;
  label: string;
  shortLabel: string;
  description: string;
  minPoints: number;
  maxPoints: number;
  icon: string;
  iconEmoji: string;
  color: string;
  bgColor: string;
  borderColor: string;
  glowColor: string;
  badgeImage?: string;
}

export const BADGE_CONFIG: Record<RankTier, BadgeInfo> = {
  [RankTier.RECRUIT]: {
    tier: RankTier.RECRUIT,
    label: 'Recruit',
    shortLabel: 'RCT',
    description: 'Junior Trader (0-500 pts)',
    minPoints: 0,
    maxPoints: 500,
    icon: '🔷',
    iconEmoji: '🔷',
    color: 'text-gray-400',
    bgColor: 'bg-gray-500/20',
    borderColor: 'border-gray-400',
    glowColor: 'shadow-lg shadow-gray-400/30',
  },
  [RankTier.ELITE_WARRIOR]: {
    tier: RankTier.ELITE_WARRIOR,
    label: 'Elite Warrior',
    shortLabel: 'ELT',
    description: 'Experienced Warrior (501-1500 pts)',
    minPoints: 501,
    maxPoints: 1500,
    icon: '⭐',
    iconEmoji: '⭐',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-400',
    glowColor: 'shadow-lg shadow-yellow-400/30',
  },
  [RankTier.COMMANDER]: {
    tier: RankTier.COMMANDER,
    label: 'Commander',
    shortLabel: 'CMD',
    description: 'Trading Commander (1501-3000 pts)',
    minPoints: 1501,
    maxPoints: 3000,
    icon: '🛡️',
    iconEmoji: '🛡️',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-400',
    glowColor: 'shadow-lg shadow-purple-400/30',
  },
  [RankTier.LEGENDARY_MENTOR]: {
    tier: RankTier.LEGENDARY_MENTOR,
    label: 'Legendary Mentor',
    shortLabel: 'LGD',
    description: 'Master Trader (3001+ pts)',
    minPoints: 3001,
    maxPoints: 99999,
    icon: '⚡✨',
    iconEmoji: '⚡',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/30',
    borderColor: 'border-amber-400',
    glowColor: 'shadow-lg shadow-amber-400/50',
  },
};

/**
 * Calculate rank tier based on total points
 */
export function calculateTierFromPoints(totalPoints: number): RankTier {
  if (totalPoints <= 500) return RankTier.RECRUIT;
  if (totalPoints <= 1500) return RankTier.ELITE_WARRIOR;
  if (totalPoints <= 3000) return RankTier.COMMANDER;
  return RankTier.LEGENDARY_MENTOR;
}

/**
 * Get badge info by points
 */
export function getBadgeByPoints(totalPoints: number): BadgeInfo {
  const tier = calculateTierFromPoints(totalPoints);
  return BADGE_CONFIG[tier];
}

/**
 * Get badge info by tier
 */
export function getBadgeByTier(tier: RankTier): BadgeInfo {
  return BADGE_CONFIG[tier];
}

/**
 * Calculate progress to next tier (0-100%)
 */
export function getProgressToNextTier(totalPoints: number): {
  current: number;
  target: number;
  progress: number; // 0-100
  remaining: number;
} {
  const tier = calculateTierFromPoints(totalPoints);
  const config = BADGE_CONFIG[tier];
  const currentMin = config.minPoints;
  
  // Get next tier
  let nextConfig: BadgeInfo | null = null;
  const tiers = Object.values(RankTier);
  const currentIndex = tiers.indexOf(tier);
  
  if (currentIndex < tiers.length - 1) {
    nextConfig = BADGE_CONFIG[tiers[currentIndex + 1]];
  }

  if (!nextConfig) {
    // Already at max tier
    return {
      current: totalPoints,
      target: config.maxPoints,
      progress: 100,
      remaining: 0,
    };
  }

  const pointsInRange = totalPoints - currentMin;
  const rangeSize = nextConfig.minPoints - currentMin;
  const progress = Math.round((pointsInRange / rangeSize) * 100);

  return {
    current: totalPoints,
    target: nextConfig.minPoints,
    progress: Math.min(progress, 100),
    remaining: Math.max(0, nextConfig.minPoints - totalPoints),
  };
}

/**
 * Format points with thousand separator
 */
export function formatPoints(points: number): string {
  return points.toLocaleString('id-ID');
}

/**
 * Calculate rank change indication
 */
export function getRankChangeIndicator(previousRank: number | null, currentRank: number): {
  indicator: 'UP' | 'DOWN' | 'STABLE';
  change: number;
  emoji: string;
} {
  if (!previousRank) {
    return { indicator: 'STABLE', change: 0, emoji: '→' };
  }

  const diff = previousRank - currentRank;
  
  if (diff > 0) {
    return { indicator: 'UP', change: diff, emoji: '↑' };
  } else if (diff < 0) {
    return { indicator: 'DOWN', change: Math.abs(diff), emoji: '↓' };
  }
  
  return { indicator: 'STABLE', change: 0, emoji: '→' };
}

/**
 * Get rank display with medal emoji
 */
export function getRankDisplay(rank: number): {
  rank: number;
  emoji: string;
  medal: string;
} {
  let emoji = '';
  let medal = '';

  if (rank === 1) {
    emoji = '🥇';
    medal = 'Gold';
  } else if (rank === 2) {
    emoji = '🥈';
    medal = 'Silver';
  } else if (rank === 3) {
    emoji = '🥉';
    medal = 'Bronze';
  } else {
    emoji = '#';
    medal = `#${rank}`;
  }

  return { rank, emoji, medal };
}

/**
 * Check if user is in Top 10 for Arka trigger
 */
export function isInTopTen(rank: number): boolean {
  return rank <= 10 && rank > 0;
}

/**
 * Get Arka trigger message
 */
export function getArkaTriggerMessage(rank: number, userName: string): string {
  if (rank === 1) {
    return `🏆 Selamat ${userName}! Anda adalah JUARA #1 di Warrior Ranking! Victory pose!`;
  } else if (rank <= 5) {
    return `⭐ Wow ${userName}! Anda masuk Top 5! Posisi #${rank}! Luar biasa!`;
  } else if (rank <= 10) {
    return `👍 Oke ${userName}! Anda masuk Top 10! Posisi #${rank}! Terus semangat!`;
  }
  return '';
}

/**
 * Calculate points breakdown from activities
 */
export function calculatePointsBreakdown(data: {
  quizzesCompleted?: number;
  quizAverageScore?: number;
  journalEntries?: number;
  commentsThisMonth?: number;
  winRate?: number;
}): {
  quizPoints: number;
  consistencyPoints: number;
  communityPoints: number;
  totalPoints: number;
} {
  let quizPoints = 0;
  let consistencyPoints = 0;
  let communityPoints = 0;

  // Quiz Points (0-40): Based on quizzes completed and average score
  if (data.quizzesCompleted && data.quizAverageScore) {
    const quizBase = Math.min(data.quizzesCompleted * 5, 30);
    const scoreBonus = Math.min((data.quizAverageScore / 100) * 10, 10);
    quizPoints = Math.round(quizBase + scoreBonus);
  }

  // Consistency Points (0-35): Based on journal entries and win rate
  if (data.journalEntries) {
    const journalBonus = Math.min(data.journalEntries * 3, 25);
    const winRateBonus = Math.min((data.winRate || 0) / 100 * 10, 10);
    consistencyPoints = Math.round(journalBonus + winRateBonus);
  }

  // Community Points (0-20): Based on active comments
  if (data.commentsThisMonth) {
    communityPoints = Math.min(data.commentsThisMonth * 2, 20);
  }

  const totalPoints = quizPoints + consistencyPoints + communityPoints;

  return {
    quizPoints,
    consistencyPoints,
    communityPoints,
    totalPoints,
  };
}
