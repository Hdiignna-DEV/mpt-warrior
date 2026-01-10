/**
 * useNotificationTriggers Hook
 * Handles event-based email notifications
 * Integrates with quiz grading, leaderboard updates, and achievements
 */

'use client';

import { useCallback } from 'react';
import {
  QuizCompletionNotification,
  TopThreeNotification,
  RankChangeNotification,
  AchievementNotification,
  WeeklyRankingSummaryNotification,
} from '@/services/emailNotificationService';

interface NotificationRecipient {
  userId: string;
  email: string;
  userName: string;
}

/**
 * Hook for sending notifications
 */
export function useNotificationTriggers() {
  /**
   * Send notification via API
   */
  const sendNotification = useCallback(
    async (notification: unknown): Promise<boolean> => {
      try {
        const response = await fetch('/api/notifications/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ notification }),
        });

        return response.ok;
      } catch (error) {
        console.error('Error sending notification:', error);
        return false;
      }
    },
    []
  );

  /**
   * Notify on quiz completion
   */
  const notifyQuizCompletion = useCallback(
    async (
      recipient: NotificationRecipient,
      quizTitle: string,
      score: number,
      percentage: number,
      passed: boolean
    ): Promise<boolean> => {
      const notification: QuizCompletionNotification = {
        type: 'quiz_completion',
        recipient,
        quizTitle,
        score,
        percentage,
        passed,
      };

      return sendNotification(notification);
    },
    [sendNotification]
  );

  /**
   * Notify on top 3 entry
   */
  const notifyTopThreeEntry = useCallback(
    async (
      recipient: NotificationRecipient,
      rank: number,
      score: number,
      previousRank?: number
    ): Promise<boolean> => {
      const notification: TopThreeNotification = {
        type: 'top_three_entry',
        recipient,
        rank,
        score,
        previousRank,
      };

      return sendNotification(notification);
    },
    [sendNotification]
  );

  /**
   * Notify on rank change
   */
  const notifyRankChange = useCallback(
    async (
      recipient: NotificationRecipient,
      newRank: number,
      previousRank: number,
      totalScore: number,
      rankChange: number
    ): Promise<boolean> => {
      // Only notify if rank changed by 5+ positions
      if (Math.abs(rankChange) < 5) {
        return true; // Silently skip small changes
      }

      const notification: RankChangeNotification = {
        type: 'rank_change',
        recipient,
        newRank,
        previousRank,
        rankChange,
        totalScore,
      };

      return sendNotification(notification);
    },
    [sendNotification]
  );

  /**
   * Notify on weekly ranking summary
   */
  const notifyWeeklySummary = useCallback(
    async (
      recipient: NotificationRecipient,
      weekPeriod: string,
      currentRank: number,
      totalScore: number,
      weeklyImprovement: number,
      topGainers: Array<{ userName: string; rankChange: number }>
    ): Promise<boolean> => {
      const notification: WeeklyRankingSummaryNotification = {
        type: 'weekly_summary',
        recipient,
        weekPeriod,
        currentRank,
        totalScore,
        weeklyImprovement,
        topGainers,
      };

      return sendNotification(notification);
    },
    [sendNotification]
  );

  /**
   * Notify on achievement unlock
   */
  const notifyAchievementUnlock = useCallback(
    async (
      recipient: NotificationRecipient,
      achievementName: string,
      achievementDescription: string,
      earnedPoints: number
    ): Promise<boolean> => {
      const notification: AchievementNotification = {
        type: 'achievement_unlock',
        recipient,
        achievementName,
        achievementDescription,
        earnedPoints,
      };

      return sendNotification(notification);
    },
    [sendNotification]
  );

  return {
    sendNotification,
    notifyQuizCompletion,
    notifyTopThreeEntry,
    notifyRankChange,
    notifyWeeklySummary,
    notifyAchievementUnlock,
  };
}

/**
 * Hook for coordinated notification triggers
 * Handles common scenarios requiring multiple notifications
 */
export function useCoordinatedNotifications() {
  const {
    notifyTopThreeEntry,
    notifyRankChange,
    notifyQuizCompletion,
  } = useNotificationTriggers();

  /**
   * Handle quiz completion with notifications
   */
  const handleQuizCompletion = useCallback(
    async (
      recipient: NotificationRecipient,
      quizData: {
        title: string;
        score: number;
        percentage: number;
        passed: boolean;
      }
    ): Promise<boolean> => {
      // Only notify if passed
      if (quizData.passed && quizData.percentage >= 70) {
        return await notifyQuizCompletion(
          recipient,
          quizData.title,
          quizData.score,
          quizData.percentage,
          quizData.passed
        );
      }
      return true;
    },
    [notifyQuizCompletion]
  );

  /**
   * Handle leaderboard update with notifications
   */
  const handleLeaderboardUpdate = useCallback(
    async (
      recipient: NotificationRecipient,
      leaderboardData: {
        newRank: number;
        previousRank: number;
        totalScore: number;
        rankChange: number;
      }
    ): Promise<void> => {
      // Notify on top 3 entry
      if (leaderboardData.newRank <= 3 && leaderboardData.previousRank > 3) {
        await notifyTopThreeEntry(
          recipient,
          leaderboardData.newRank,
          leaderboardData.totalScore,
          leaderboardData.previousRank
        );
      }

      // Notify on significant rank change (5+ positions)
      if (Math.abs(leaderboardData.rankChange) >= 5) {
        await notifyRankChange(
          recipient,
          leaderboardData.newRank,
          leaderboardData.previousRank,
          leaderboardData.totalScore,
          leaderboardData.rankChange
        );
      }
    },
    [notifyTopThreeEntry, notifyRankChange]
  );

  return {
    handleQuizCompletion,
    handleLeaderboardUpdate,
  };
}
