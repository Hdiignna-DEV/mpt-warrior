/**
 * API Route: /api/leaderboard/cron-update
 * Automatically update leaderboard rankings every hour
 * Can be triggered by:
 * 1. Vercel Cron (free tier: every hour)
 * 2. External cron service (EasyCron, AWS EventBridge, etc.)
 * 3. Manual trigger from admin panel
 * 
 * Authorization: Vercel Cron Token or Bearer token
 */

import { NextRequest, NextResponse } from 'next/server';
import { updateLeaderboardRanking } from '@/lib/db/education-service';
import { deleteCachedValue } from '@/lib/cache/redis-cache';

const LEADERBOARD_CACHE_KEY = 'leaderboard:top100:v1';

export async function POST(request: NextRequest) {
  try {
    // Verify request is from Vercel Cron or has valid authorization
    const authHeader = request.headers.get('authorization');
    const cronToken = request.headers.get('x-cron-token');
    
    // Allow Vercel Cron (uses Authorization header with Bearer token)
    // or custom cron token for other services
    const isValidCron = 
      cronToken === process.env.CRON_SECRET ||
      authHeader === `Bearer ${process.env.CRON_SECRET}`;

    if (!isValidCron) {
      // For security, silently fail without revealing verification method
      console.warn('⚠️ Leaderboard cron update attempted without valid token');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🔄 Starting automated leaderboard update (cron)...');
    const startTime = Date.now();

    // Update leaderboard rankings
    await updateLeaderboardRanking();

    // Clear Redis cache to force fresh fetch on next request
    await deleteCachedValue(LEADERBOARD_CACHE_KEY);
    console.log('✅ Cache cleared');

    const duration = Date.now() - startTime;
    console.log(`✅ Leaderboard auto-update complete (${duration}ms)`);

    return NextResponse.json({
      success: true,
      message: 'Leaderboard rankings updated successfully',
      updatedAt: new Date().toISOString(),
      duration: `${duration}ms`,
      cacheCleared: true
    });

  } catch (error: any) {
    console.error('❌ Error in leaderboard cron update:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update leaderboard'
      },
      { status: 500 }
    );
  }
}

// GET endpoint for health check
export async function GET(request: NextRequest) {
  try {
    // Only allow from internal Vercel or with token
    const cronToken = request.headers.get('x-cron-token');
    if (cronToken !== process.env.CRON_SECRET) {
      return NextResponse.json(
        { error: 'Health check OK' },
        { status: 200 }
      );
    }

    return NextResponse.json({
      status: 'healthy',
      endpoint: '/api/leaderboard/cron-update',
      method: 'POST with CRON_SECRET token',
      lastUpdate: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', error: 'Service unavailable' },
      { status: 503 }
    );
  }
}
