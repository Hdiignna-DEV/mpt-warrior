/**
 * API Route: /api/leaderboard/sync-points
 * POST - Sync points from completed quiz/journal/comment
 * Body: { userId, pointType: 'quiz'|'journal'|'comment', points, sourceId }
 * This endpoint is called after quiz completion, journal entry, or comment posting
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getCosmosClient } from '@/lib/db/cosmos-client';
import { determineTier } from '@/utils/ranking';
import { deleteCachedValue } from '@/lib/cache/redis-cache';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, pointType, points, sourceId } = body;

    // Validate inputs
    if (!userId || !pointType || points === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, pointType, points' },
        { status: 400 }
      );
    }

    if (!['quiz', 'journal', 'comment'].includes(pointType)) {
      return NextResponse.json(
        { error: 'Invalid pointType' },
        { status: 400 }
      );
    }

    const database = getCosmosClient().database('mpt-warrior');
    const usersContainer = database.container('users');
    const pointLogsContainer = database.container('point_logs');

    // Get user
    const { resource: user } = await usersContainer.item(userId, userId).read<any>();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const previousTotalPoints = user.totalPoints || 0;
    const previousTier = user.tier || 'RECRUIT';

    // Update points based on type
    switch (pointType) {
      case 'quiz': {
        const quizPoints = user.pointsBreakdown?.quizPoints || 0;
        user.pointsBreakdown = {
          ...user.pointsBreakdown,
          quizPoints: Math.min(quizPoints + points, 40), // Max 40 points from quiz
        };
        break;
      }
      case 'journal': {
        const consistencyPoints = user.pointsBreakdown?.consistencyPoints || 0;
        user.pointsBreakdown = {
          ...user.pointsBreakdown,
          consistencyPoints: Math.min(consistencyPoints + points, 35), // Max 35 points
        };
        
        // Update journal tracking
        const today = new Date().toDateString();
        const lastEntry = user.journalEntries?.lastEntryDate;
        
        user.journalEntries = {
          ...user.journalEntries,
          lastEntryDate: today,
          entriesThisWeek: (user.journalEntries?.entriesThisWeek || 0) + 1,
          consecutiveDays: lastEntry === today 
            ? user.journalEntries?.consecutiveDays || 1
            : (user.journalEntries?.consecutiveDays || 0) + 1,
          allTimeDays: (user.journalEntries?.allTimeDays || 0) + 1,
        };
        break;
      }
      case 'comment': {
        const communityPoints = user.pointsBreakdown?.communityPoints || 0;
        user.pointsBreakdown = {
          ...user.pointsBreakdown,
          communityPoints: Math.min(communityPoints + points, 20), // Max 20 points
        };

        user.commentStats = {
          ...user.commentStats,
          thisWeek: (user.commentStats?.thisWeek || 0) + 1,
          thisMonth: (user.commentStats?.thisMonth || 0) + 1,
          allTime: (user.commentStats?.allTime || 0) + 1,
          lastCommentDate: new Date().toISOString(),
        };
        break;
      }
    }

    // Recalculate total points from breakdown
    const breakdown = user.pointsBreakdown;
    user.totalPoints = (breakdown?.quizPoints || 0) + 
                      (breakdown?.consistencyPoints || 0) + 
                      (breakdown?.communityPoints || 0);

    // Update tier based on new total
    const newTier = determineTier(user.totalPoints);
    const tierChanged = newTier !== previousTier;
    
    user.tier = newTier;
    user.lastRankUpdate = new Date().toISOString();

    await usersContainer.item(userId, userId).replace(user);

    // Log point change
    await pointLogsContainer.items.create({
      userId,
      action: 'POINT_UPDATE',
      pointType,
      pointsAdded: points,
      previousPoints: previousTotalPoints,
      newPoints: user.totalPoints,
      previousTier,
      newTier,
      tierChanged,
      breakdown: user.pointsBreakdown,
      sourceId,
      timestamp: new Date().toISOString(),
    });

    // Invalidate caches
    await deleteCachedValue('leaderboard:top100:v1');
    await deleteCachedValue('leaderboard:top3:v1');
    await deleteCachedValue(`user:ranking:${userId}`);

    return NextResponse.json({
      success: true,
      message: `Points synced for ${pointType}`,
      userId,
      pointsAdded: points,
      totalPoints: user.totalPoints,
      tier: user.tier,
      tierChanged,
    });

  } catch (error: any) {
    console.error('Error syncing points:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to sync points' },
      { status: 500 }
    );
  }
}
