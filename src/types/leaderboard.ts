/**
 * Types & Interfaces for Warrior Ranking System
 * File: src/types/leaderboard.ts
 */

export enum RankTier {
  RECRUIT = 'RECRUIT',
  ELITE_WARRIOR = 'ELITE_WARRIOR',
  COMMANDER = 'COMMANDER',
  LEGENDARY_MENTOR = 'LEGENDARY_MENTOR',
}

export enum AchievementBadge {
  CONSISTENCY_KING = 'consistency_king',
  KNOWLEDGE_MASTER = 'knowledge_master',
  COMMUNITY_CHAMPION = 'community_champion',
  TOP_PERFORMER = 'top_performer',
  COMEBACK_WARRIOR = 'comeback_warrior',
}

export interface RankingPoints {
  quizPoints: number;        // 0-40
  consistencyPoints: number; // 0-35
  communityPoints: number;   // 0-20
}

export interface LeaderboardEntry {
  userId: string;
  rank: number;
  userName: string;
  avatar?: string;
  tier: RankTier;
  totalPoints: number;
  weeklyPoints?: number;
  pointsBreakdown: RankingPoints;
  badges: AchievementBadge[];
  winRate: number;
  rankChange: number; // negative = improved, positive = declined
  isCurrentUser?: boolean;
}

export interface TopThreeEntry {
  rank: 1 | 2 | 3;
  userId: string;
  userName: string;
  avatar: string;
  tier: RankTier;
  totalPoints: number;
}

export interface UserRankingDetail {
  userId: string;
  userName: string;
  tier: RankTier;
  currentRank: number;
  previousRank: number;
  totalPoints: number;
  weeklyPoints: number;
  monthlyPoints: number;
  pointsBreakdown: RankingPoints;
  badges: AchievementBadge[];
  winRate: number;
  
  // Stats
  journalStats: {
    entriesThisWeek: number;
    consecutiveDays: number;
    allTimeDays: number;
  };
  quizStats: {
    modulesCompleted: number;
    averageScore: number;
    highestScore: number;
    lowestScore: number;
  };
  commentStats: {
    thisWeek: number;
    thisMonth: number;
    allTime: number;
  };
  
  percentileRank: number; // 0-100
}

export interface LeaderboardFilter {
  period: 'WEEK' | 'MONTH' | 'ALL_TIME';
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'rank' | 'points' | 'winRate' | 'tier';
  sortOrder?: 'asc' | 'desc';
}

export interface LeaderboardResponse {
  data: LeaderboardEntry[];
  metadata: {
    total: number;
    period: string;
    lastUpdated: string;
    generatedAt: string;
    hasMore: boolean;
    offset: number;
    limit: number;
  };
}

export interface RecalculateRankingRequest {
  userId: string;
  action: 'QUIZ_COMPLETED' | 'JOURNAL_ENTRY' | 'COMMENT_ADDED' | 'ADMIN_OVERRIDE';
  actionId?: string;
  pointsAdjustment?: number;
  reason?: string;
}

export interface RecalculateRankingResponse {
  success: boolean;
  userId: string;
  previousRank: number;
  newRank: number;
  pointsChange: number;
  totalPointsChange: number;
  previousTotal: number;
  newTotal: number;
  previousTier: RankTier;
  newTier: RankTier;
  tierChanged: boolean;
  badgesEarned: AchievementBadge[];
  badgesLost: AchievementBadge[];
  achievedTopTen: boolean;
  timestamp: string;
}

export interface PointLog {
  id: string;
  userId: string;
  timestamp: string;
  action: 'QUIZ_COMPLETED' | 'JOURNAL_ENTRY' | 'COMMENT_ADDED' | 'MANUAL_ADJUSTMENT' | 'CORRECTION' | 'ADMIN_OVERRIDE';
  pointsAdded: number;
  pointsSource: 'quiz' | 'journal' | 'comment' | 'admin';
  details: {
    quizId?: string;
    journalDate?: string;
    commentId?: string;
    adminNote?: string;
  };
  previousTotal: number;
  newTotal: number;
  previousRank: number;
  newRank: number;
  previousTier: RankTier;
  newTier: RankTier;
}

export interface RankHistory {
  userId: string;
  date: string; // ISO date YYYY-MM-DD
  rank: number;
  totalPoints: number;
  weeklyPoints: number;
  tier: RankTier;
}

export interface LeaderboardSnapshot {
  id: string;
  date: string; // ISO timestamp
  period: 'WEEKLY' | 'MONTHLY' | 'ALL_TIME';
  rankings: LeaderboardEntry[];
  topThree: TopThreeEntry[];
  metadata: {
    totalUsers: number;
    averagePoints: number;
    medianPoints: number;
  };
}

export interface BadgeRequirements {
  consistency_king: { requirementType: 'consecutive_days'; value: 30 };
  knowledge_master: { requirementType: 'modules_average'; modulesCount: number; minAverage: 80 };
  community_champion: { requirementType: 'meaningful_comments'; value: 100 };
  top_performer: { requirementType: 'rank_duration'; rank: number; weeks: number };
  comeback_warrior: { requirementType: 'rank_improvement'; positionsGained: 20; days: 7 };
}

export interface TierConfiguration {
  tier: RankTier;
  minPoints: number;
  maxPoints: number;
  icon: string;
  emoji: string;
  color: string;
  description: string;
  label: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  date: string; // ISO date
  content: string;
  createdAt: string;
}

export interface CommentMetadata {
  id: string;
  userId: string;
  content: string;
  length: number;
  createdAt: string;
  moduleId?: string;
  forumId?: string;
}

// Configuration for point calculations
export const POINT_WEIGHTS = {
  QUIZ: 0.40,           // 40%
  CONSISTENCY: 0.35,    // 35%
  COMMUNITY: 0.25,      // 25%
} as const;

export const TIER_CONFIG: Record<RankTier, TierConfiguration> = {
  [RankTier.RECRUIT]: {
    tier: RankTier.RECRUIT,
    minPoints: 0,
    maxPoints: 500,
    icon: '▮',
    emoji: '🥲',
    color: 'gray',
    description: 'Pemula yang belajar basics',
    label: 'Recruit',
  },
  [RankTier.ELITE_WARRIOR]: {
    tier: RankTier.ELITE_WARRIOR,
    minPoints: 501,
    maxPoints: 1500,
    icon: '▮▮',
    emoji: '⚔️',
    color: 'blue',
    description: 'Trader konsisten dengan mindset solid',
    label: 'Elite Warrior',
  },
  [RankTier.COMMANDER]: {
    tier: RankTier.COMMANDER,
    minPoints: 1501,
    maxPoints: 3000,
    icon: '★',
    emoji: '🎖️',
    color: 'gold',
    description: 'Mentor dengan discipline tinggi & win rate bagus',
    label: 'Commander',
  },
  [RankTier.LEGENDARY_MENTOR]: {
    tier: RankTier.LEGENDARY_MENTOR,
    minPoints: 3001,
    maxPoints: Infinity,
    icon: '✨★',
    emoji: '👑',
    color: 'platinum',
    description: 'Master trader - exemplar dari MPT philosophy',
    label: 'Legendary Mentor',
  },
};

export const BADGE_CONFIG: Record<AchievementBadge, { label: string; icon: string; description: string }> = {
  [AchievementBadge.CONSISTENCY_KING]: {
    label: 'Consistency King',
    icon: '🔥',
    description: '30+ consecutive days with journal entries',
  },
  [AchievementBadge.KNOWLEDGE_MASTER]: {
    label: 'Knowledge Master',
    icon: '📚',
    description: 'Completed all modules with average score ≥80%',
  },
  [AchievementBadge.COMMUNITY_CHAMPION]: {
    label: 'Community Champion',
    icon: '💬',
    description: '100+ meaningful discussion comments',
  },
  [AchievementBadge.TOP_PERFORMER]: {
    label: 'Top Performer',
    icon: '📈',
    description: 'Maintained Top 1-3 ranking for 2+ consecutive weeks',
  },
  [AchievementBadge.COMEBACK_WARRIOR]: {
    label: 'Comeback Warrior',
    icon: '🏅',
    description: 'Rose 20+ positions within 1 week',
  },
};
