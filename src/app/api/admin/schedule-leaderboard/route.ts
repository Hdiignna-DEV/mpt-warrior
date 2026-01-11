/**
 * API Route: /api/admin/schedule-leaderboard
 * POST - Schedule automatic leaderboard updates (Super Admin only)
 * GET - Get current schedule status
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getCosmosClient } from '@/lib/db/cosmos-client';

// In-memory schedule state (in production, use database or task queue)
let leaderboardSchedule: {
  enabled: boolean;
  intervalMinutes: number;
  lastRunAt: string | null;
  nextRunAt: string | null;
  runCount: number;
} = {
  enabled: false,
  intervalMinutes: 60,
  lastRunAt: null,
  nextRunAt: null,
  runCount: 0
};

let schedulerInterval: ReturnType<typeof setInterval> | null = null;

/**
 * Start automatic scheduler
 */
async function startScheduler(intervalMinutes: number = 60) {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
  }

  console.log(`🕐 Starting leaderboard scheduler (every ${intervalMinutes} minutes)`);
  
  // Run immediately
  await triggerLeaderboardUpdate();
  
  // Schedule recurring updates
  schedulerInterval = setInterval(async () => {
    await triggerLeaderboardUpdate();
  }, intervalMinutes * 60 * 1000);

  leaderboardSchedule.enabled = true;
  leaderboardSchedule.intervalMinutes = intervalMinutes;
  scheduleNextRun(intervalMinutes);
}

/**
 * Stop scheduler
 */
function stopScheduler() {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
  }
  leaderboardSchedule.enabled = false;
  console.log('🛑 Leaderboard scheduler stopped');
}

/**
 * Trigger leaderboard update
 */
async function triggerLeaderboardUpdate() {
  try {
    console.log('🔄 Running scheduled leaderboard update...');
    
    // Call the leaderboard update logic directly
    const { updateLeaderboardRanking } = await import('@/lib/db/education-service');
    await updateLeaderboardRanking();
    
    // Clear cache
    const { deleteCachedValue } = await import('@/lib/cache/redis-cache');
    await deleteCachedValue('leaderboard:top100:v1');
    
    leaderboardSchedule.lastRunAt = new Date().toISOString();
    leaderboardSchedule.runCount++;
    scheduleNextRun(leaderboardSchedule.intervalMinutes);
    
    console.log('✅ Scheduled leaderboard update completed');
  } catch (error) {
    console.error('❌ Scheduled update failed:', error);
  }
}

/**
 * Calculate next run time
 */
function scheduleNextRun(intervalMinutes: number) {
  const nextRun = new Date();
  nextRun.setMinutes(nextRun.getMinutes() + intervalMinutes);
  leaderboardSchedule.nextRunAt = nextRun.toISOString();
}

export async function GET(request: NextRequest) {
  try {
    const decoded = await verifyToken(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is super admin (from JWT token)
    if (decoded.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Super Admin only' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      schedule: leaderboardSchedule
    });

  } catch (error: any) {
    console.error('Error getting schedule status:', error);
    return NextResponse.json(
      { error: 'Failed to get schedule status' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const decoded = await verifyToken(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is super admin (from JWT token)
    if (decoded.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Super Admin only' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action, intervalMinutes = 60 } = body;

    if (action === 'start') {
      await startScheduler(intervalMinutes);
      return NextResponse.json({
        success: true,
        message: `Leaderboard scheduler started (${intervalMinutes} minutes interval)`,
        schedule: leaderboardSchedule
      });
    } else if (action === 'stop') {
      stopScheduler();
      return NextResponse.json({
        success: true,
        message: 'Leaderboard scheduler stopped',
        schedule: leaderboardSchedule
      });
    } else if (action === 'run-now') {
      await triggerLeaderboardUpdate();
      return NextResponse.json({
        success: true,
        message: 'Leaderboard update triggered immediately',
        schedule: leaderboardSchedule
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "start", "stop", or "run-now"' },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error('Error managing schedule:', error);
    return NextResponse.json(
      { error: 'Failed to manage schedule', details: error.message },
      { status: 500 }
    );
  }
}
