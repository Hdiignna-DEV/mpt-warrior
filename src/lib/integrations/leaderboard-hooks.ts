/**
 * Integration Hooks - Warrior Ranking System
 * File: src/lib/integrations/leaderboard-hooks.ts
 * 
 * Hooks to call sync-points API when:
 * 1. Quiz is completed
 * 2. Journal entry is saved
 * 3. Comment is posted
 */

import { deleteCachedValue, setCachedValue } from '@/lib/cache/redis-cache';

/**
 * HOOK 1: Called after quiz completion (from education-service)
 * Syncs quiz points to ranking system
 */
export async function onQuizCompleted(
  userId: string,
  moduleId: string,
  score: number,
  quizId: string,
  token?: string
) {
  try {
    console.log(`📊 Quiz completed for user ${userId}: score ${score}%`);

    // Calculate points contribution: 0-40 points based on score
    // Formula: (score / 100) * 40
    const quizPoints = Math.round((score / 100) * 40);

    // Call sync-points endpoint
    const response = await fetch('/api/leaderboard/sync-points', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify({
        userId,
        pointType: 'quiz',
        points: quizPoints,
        sourceId: quizId,
        metadata: {
          moduleId,
          score,
        },
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`✅ Quiz points synced: ${quizPoints} points`);
      return result;
    } else {
      console.error('❌ Failed to sync quiz points:', response.statusText);
    }
  } catch (error) {
    console.error('❌ Error syncing quiz points:', error);
    // Don't throw - this is non-blocking
  }
}

/**
 * HOOK 2: Called after journal/trade entry is saved
 * Syncs journal consistency points to ranking system
 */
export async function onJournalEntrySaved(
  userId: string,
  entryId: string,
  entryDate: string,
  token?: string
) {
  try {
    console.log(`📝 Journal entry saved for user ${userId}: ${entryDate}`);

    // Check if entry is from today (consistency day)
    const today = new Date().toDateString();
    const entryDateObj = new Date(entryDate).toDateString();
    
    if (entryDateObj === today) {
      // 5 points per unique day for consistency
      const journalPoints = 5;

      const response = await fetch('/api/leaderboard/sync-points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({
          userId,
          pointType: 'journal',
          points: journalPoints,
          sourceId: entryId,
          metadata: {
            entryDate: entryDateObj,
          },
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Journal points synced: ${journalPoints} points`);
        return result;
      } else {
        console.error('❌ Failed to sync journal points:', response.statusText);
      }
    }
  } catch (error) {
    console.error('❌ Error syncing journal points:', error);
    // Don't throw - this is non-blocking
  }
}

/**
 * HOOK 3: Called after comment is posted in discussions
 * Syncs community engagement points to ranking system
 */
export async function onCommentPosted(
  userId: string,
  commentId: string,
  comment: string,
  token?: string
) {
  try {
    console.log(`💬 Comment posted by user ${userId}`);

    // Check comment quality (min 10 characters)
    if (comment.length < 10) {
      console.log('⚠️ Comment too short, skipping points');
      return;
    }

    // 2 points per meaningful comment (max 10 per week = 20 points)
    const commentPoints = 2;

    const response = await fetch('/api/leaderboard/sync-points', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify({
        userId,
        pointType: 'comment',
        points: commentPoints,
        sourceId: commentId,
        metadata: {
          commentLength: comment.length,
        },
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`✅ Comment points synced: ${commentPoints} points`);
      return result;
    } else {
      console.error('❌ Failed to sync comment points:', response.statusText);
    }
  } catch (error) {
    console.error('❌ Error syncing comment points:', error);
    // Don't throw - this is non-blocking
  }
}

/**
 * UTILITY: Invalidate leaderboard caches
 * Call this after any point update
 */
export async function invalidateLeaderboardCaches() {
  try {
    await Promise.all([
      deleteCachedValue('leaderboard:top100:v1'),
      deleteCachedValue('leaderboard:top3:v1'),
    ]);
    console.log('✅ Leaderboard caches invalidated');
  } catch (error) {
    console.error('⚠️ Error invalidating caches:', error);
  }
}

/**
 * UTILITY: Get current user's leaderboard stats
 */
export async function getUserLeaderboardStats(
  userId: string,
  token: string
): Promise<any> {
  try {
    const response = await fetch(`/api/leaderboard/user/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.error('Failed to get user stats:', response.statusText);
      return null;
    }
  } catch (error) {
    console.error('Error getting user stats:', error);
    return null;
  }
}

/**
 * UTILITY: Get top 3 users for dashboard widget
 */
export async function getTopThreeUsers(token: string): Promise<any> {
  try {
    const response = await fetch('/api/leaderboard/top-three', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.error('Failed to get top 3:', response.statusText);
      return null;
    }
  } catch (error) {
    console.error('Error getting top 3:', error);
    return null;
  }
}
