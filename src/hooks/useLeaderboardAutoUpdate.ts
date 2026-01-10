/**
 * useLeaderboardAutoUpdate Hook
 * Automatically updates leaderboard when quiz is completed or achievements happen
 * Integrates with Arka reactions
 */

'use client';

import { useCallback, useState } from 'react';
import { useArkaPoseController } from './useArkaPoseController';

export interface LeaderboardUpdateEvent {
  eventType: 'quiz_complete' | 'achievement' | 'streak_milestone' | 'top_three';
  quizPercentage?: number;
  quizTitle?: string;
  achievement?: string;
  streakDays?: number;
  newRank?: number;
}

export interface LeaderboardUpdateResult {
  success: boolean;
  totalScore: number;
  quizScore: number;
  chatActivityScore: number;
  streakBonus: number;
  achievementBonus: number;
  rankImprovement?: number;
  enteredTopThree: boolean;
  message: string;
}

/**
 * useLeaderboardAutoUpdate Hook
 * Triggers leaderboard updates and Arka reactions
 */
export function useLeaderboardAutoUpdate() {
  const { triggerVictory, triggerWarning } = useArkaPoseController();

  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<LeaderboardUpdateResult | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  /**
   * Update leaderboard after event
   */
  const updateOnEvent = useCallback(
    async (
      event: LeaderboardUpdateEvent,
      userId: string
    ): Promise<LeaderboardUpdateResult> => {
      try {
        setIsUpdating(true);
        setError(null);

        // Determine what to send based on event type
        let payload: any = { userId };

        switch (event.eventType) {
          case 'quiz_complete':
            payload.quizPercentage = event.quizPercentage || 0;
            triggerVictory(
              event.quizPercentage! >= 70
                ? `Great job on ${event.quizTitle}! 🎯`
                : `Let's improve on ${event.quizTitle}! 📚`
            );
            break;

          case 'achievement':
            payload.achievements = [event.achievement];
            triggerVictory(`Achievement unlocked: ${event.achievement}! 🏆`);
            break;

          case 'streak_milestone':
            payload.currentStreak = event.streakDays;
            triggerVictory(`${event.streakDays} day streak! 🔥`);
            break;

          case 'top_three':
            triggerVictory(`You entered top 3! 🏅`);
            break;
        }

        // Call leaderboard update API
        const response = await fetch('/api/leaderboard/update-score', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': userId,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Failed to update leaderboard');
        }

        const { data } = await response.json();

        const result: LeaderboardUpdateResult = {
          success: true,
          totalScore: data.totalScore,
          quizScore: data.quizScore,
          chatActivityScore: data.chatActivityScore,
          streakBonus: data.streakBonus,
          achievementBonus: data.achievementBonus,
          enteredTopThree: event.eventType === 'top_three',
          message: `Leaderboard updated! Total score: ${data.totalScore}`,
        };

        setLastUpdate(result);
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
        triggerWarning(`Leaderboard update failed: ${message}`);
        throw err;
      } finally {
        setIsUpdating(false);
      }
    },
    [triggerVictory, triggerWarning]
  );

  /**
   * Quick update after quiz completion
   */
  const updateQuizCompletion = useCallback(
    async (userId: string, percentage: number, title?: string) => {
      return updateOnEvent(
        {
          eventType: 'quiz_complete',
          quizPercentage: percentage,
          quizTitle: title,
        },
        userId
      );
    },
    [updateOnEvent]
  );

  /**
   * Quick update for achievement unlock
   */
  const updateAchievementUnlock = useCallback(
    async (userId: string, achievement: string) => {
      return updateOnEvent(
        {
          eventType: 'achievement',
          achievement,
        },
        userId
      );
    },
    [updateOnEvent]
  );

  /**
   * Quick update for streak milestone
   */
  const updateStreakMilestone = useCallback(
    async (userId: string, streakDays: number) => {
      return updateOnEvent(
        {
          eventType: 'streak_milestone',
          streakDays,
        },
        userId
      );
    },
    [updateOnEvent]
  );

  /**
   * Quick update for top 3 entry
   */
  const updateTopThreeEntry = useCallback(
    async (userId: string, newRank: number) => {
      return updateOnEvent(
        {
          eventType: 'top_three',
          newRank,
        },
        userId
      );
    },
    [updateOnEvent]
  );

  return {
    // State
    isUpdating,
    lastUpdate,
    error,

    // General method
    updateOnEvent,

    // Convenience methods
    updateQuizCompletion,
    updateAchievementUnlock,
    updateStreakMilestone,
    updateTopThreeEntry,

    // Helpers
    lastTotalScore: lastUpdate?.totalScore || 0,
    wasTopThreeEntry: lastUpdate?.enteredTopThree || false,
  };
}

/**
 * useLeaderboardStats Hook
 * Get user's leaderboard statistics
 */
export function useLeaderboardStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUserStats = useCallback(
    async (userId: string) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/leaderboard/user/${userId}`,
          {
            headers: {
              'x-user-id': userId,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }

        const { data } = await response.json();
        setStats(data);
        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    stats,
    loading,
    error,
    getUserStats,
    userRank: stats?.rank,
    totalScore: stats?.totalScore || 0,
  };
}
