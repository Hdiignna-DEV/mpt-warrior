/**
 * Leaderboard Auto-Update Service
 * Handles score calculation and ranking logic
 * NOTE: This service handles calculations only.
 * Database operations are handled via API routes for better separation of concerns.
 */

export interface UserScore {
  userId: string;
  userName: string;
  quizScore: number; // 0-40
  chatActivityScore: number; // 0-30
  streakBonus: number; // 0-20
  achievementBonus: number; // 0-10
  totalScore: number; // 0-100
  weekNumber: number;
  period: string; // ISO week string
  rank?: number;
  previousRank?: number;
  rankChange?: number;
  isTopThree?: boolean;
  updatedAt: Date;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  totalScore: number;
  quizScore: number;
  chatActivityScore: number;
  streakBonus: number;
  achievementBonus: number;
  rankChange: number;
  isTopThree: boolean;
  weekNumber: number;
  period: string;
}

export interface ScoringFactors {
  userId: string;
  quizPercentage?: number; // 0-100
  messagesThisWeek?: number; // count
  currentStreak?: number; // days
  achievements?: string[]; // achievement IDs earned this week
}

/**
 * LeaderboardAutoUpdateService
 * Handles score calculation and ranking logic
 */
export class LeaderboardAutoUpdateService {
  /**
   * Calculate score breakdown for a user
   */
  static calculateUserScore(factors: ScoringFactors): UserScore {
    // Quiz score: 0-40 points
    const quizScore = Math.min(
      40,
      Math.round(((factors.quizPercentage || 0) / 100) * 40)
    );

    // Chat activity score: 0-30 points
    const chatActivityScore = Math.min(30, factors.messagesThisWeek || 0);

    // Streak bonus: 0-20 points
    const streakBonus = Math.min(
      20,
      Math.floor((factors.currentStreak || 0) * 0.5)
    );

    // Achievement bonus: 0-10 points
    const achievementBonus = Math.min(
      10,
      (factors.achievements?.length || 0) * 2
    );

    const totalScore = quizScore + chatActivityScore + streakBonus + achievementBonus;

    const now = new Date();
    const weekNumber = this.getWeekNumber(now);
    const period = this.getWeekString(now);

    return {
      userId: factors.userId,
      userName: '',
      quizScore,
      chatActivityScore,
      streakBonus,
      achievementBonus,
      totalScore,
      weekNumber,
      period,
      updatedAt: now,
    };
  }

  /**
   * Calculate weekly rankings from user scores
   */
  static calculateWeeklyRankings(scores: UserScore[]): LeaderboardEntry[] {
    const sorted = [...scores].sort((a, b) => b.totalScore - a.totalScore);

    return sorted.map((score, index) => ({
      rank: index + 1,
      userId: score.userId,
      userName: score.userName,
      totalScore: score.totalScore,
      quizScore: score.quizScore,
      chatActivityScore: score.chatActivityScore,
      streakBonus: score.streakBonus,
      achievementBonus: score.achievementBonus,
      rankChange: score.rankChange || 0,
      isTopThree: index < 3,
      weekNumber: score.weekNumber,
      period: score.period,
    }));
  }

  /**
   * Check if user entered top 3
   */
  static checkTopThreeEntry(previousRank: number | null, currentRank: number): boolean {
    const isNowInTopThree = currentRank <= 3;
    const wasNotInTopThree = previousRank === null || previousRank > 3;
    return isNowInTopThree && wasNotInTopThree;
  }

  /**
   * Calculate rank change
   */
  static calculateRankChange(previousRank: number | null, currentRank: number): number {
    if (previousRank === null) return 0;
    return previousRank - currentRank;
  }

  /**
   * Get ISO week number for a given date
   */
  private static getWeekNumber(date: Date): number {
    const target = new Date(date);
    const thursday = new Date(target.setDate(target.getDate() - target.getDay() + 4));
    const year = thursday.getFullYear();
    const firstThursday = new Date(year, 0, 4);
    firstThursday.setDate(firstThursday.getDate() - firstThursday.getDay() + 4);
    
    const weekNum = Math.floor((thursday.getTime() - firstThursday.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;
    return weekNum;
  }

  /**
   * Get ISO week string (e.g., "2026-W03")
   */
  private static getWeekString(date: Date): string {
    const year = date.getFullYear();
    const week = this.getWeekNumber(date);
    return `${year}-W${String(week).padStart(2, '0')}`;
  }

  /**
   * Get top N users by score
   */
  static getTopUsers(entries: LeaderboardEntry[], limit: number = 10): LeaderboardEntry[] {
    return entries.slice(0, Math.min(limit, entries.length));
  }

  /**
   * Get user's current rank and score
   */
  static getUserRank(entries: LeaderboardEntry[], userId: string): LeaderboardEntry | null {
    return entries.find((entry) => entry.userId === userId) || null;
  }

  /**
   * Get users who gained positions
   */
  static getPositionGainers(entries: LeaderboardEntry[], limit: number = 5): LeaderboardEntry[] {
    return entries
      .filter((entry) => entry.rankChange > 0)
      .sort((a, b) => b.rankChange - a.rankChange)
      .slice(0, Math.min(limit, entries.length));
  }

  /**
   * Get users who dropped positions
   */
  static getPositionDroppers(entries: LeaderboardEntry[], limit: number = 5): LeaderboardEntry[] {
    return entries
      .filter((entry) => entry.rankChange < 0)
      .sort((a, b) => a.rankChange - b.rankChange)
      .slice(0, Math.min(limit, entries.length));
  }
}

/**
 * Batch calculate scores
 */
export function batchCalculateScores(factorsList: ScoringFactors[]): UserScore[] {
  return factorsList.map((factors) => LeaderboardAutoUpdateService.calculateUserScore(factors));
}
