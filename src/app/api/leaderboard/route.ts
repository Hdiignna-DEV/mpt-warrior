/**
 * API Route: /api/leaderboard
 * GET - Get leaderboard top users with Redis caching (filters out admin/super admin)
 * POST - Recalculate leaderboard rankings (Super Admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getLeaderboardTop, updateLeaderboardRanking } from '@/lib/db/education-service';
import { getCosmosClient } from '@/lib/db/cosmos-client';
import { getCachedValue, setCachedValue, deleteCachedValue } from '@/lib/cache/redis-cache';

const LEADERBOARD_CACHE_KEY = 'leaderboard:top100:v1';
const CACHE_TTL = 3600; // 1 hour in seconds (Redis native)

// Fallback in-memory cache if Redis unavailable
let leaderboardCacheFallback: any = null;
let leaderboardCacheTime = 0;

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // Try Redis cache first
    console.log('🔍 Checking Redis cache...');
    const cachedData = await getCachedValue<any[]>(LEADERBOARD_CACHE_KEY);
    
    if (cachedData && cachedData.length > 0) {
      console.log('✅ Redis cache HIT');
      return NextResponse.json({
        success: true,
        leaderboard: cachedData.slice(offset, offset + limit),
        total: cachedData.length,
        cached: true,
        cacheSource: 'redis'
      });
    }

    // Check fallback in-memory cache
    const now = Date.now();
    if (leaderboardCacheFallback && (now - leaderboardCacheTime) < (CACHE_TTL * 1000)) {
      console.log('📦 Using fallback in-memory cache');
      return NextResponse.json({
        success: true,
        leaderboard: leaderboardCacheFallback.slice(offset, offset + limit),
        total: leaderboardCacheFallback.length,
        cached: true,
        cacheSource: 'memory'
      });
    }

    // Cache miss - fetch from database and filter
    console.log('🔄 Fetching leaderboard from database');
    const allLeaderboard = await getLeaderboardTop(1000, 0);
    const database = getCosmosClient().database('mpt-warrior');
    const usersContainer = database.container('users');
    
    const filteredLeaderboard = [];
    for (const entry of allLeaderboard) {
      try {
        const { resource: userDoc } = await usersContainer.item(entry.userId, entry.userId).read<any>();
        // Only include WARRIOR role users (exclude ADMIN and SUPER_ADMIN)
        if (userDoc && userDoc.role === 'WARRIOR') {
          filteredLeaderboard.push(entry);
        }
      } catch (error) {
        // User not found or error, skip
      }
    }
    
    // Save to Redis cache
    await setCachedValue(LEADERBOARD_CACHE_KEY, filteredLeaderboard, CACHE_TTL);
    
    // Also update fallback in-memory cache
    leaderboardCacheFallback = filteredLeaderboard;
    leaderboardCacheTime = now;

    return NextResponse.json({
      success: true,
      leaderboard: filteredLeaderboard.slice(offset, offset + limit),
      total: filteredLeaderboard.length,
      cached: false,
      cacheSource: 'database'
    });

  } catch (error: any) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST - Trigger manual leaderboard recalculation (Super Admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const decoded = await verifyToken(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is super admin in database
    const database = getCosmosClient().database('mpt-warrior');
    const usersContainer = database.container('users');
    
    try {
      const { resource: userDoc } = await usersContainer
        .item(decoded.userId, decoded.userId)
        .read<any>();
      
      if (!userDoc || userDoc.role !== 'SUPER_ADMIN') {
        return NextResponse.json(
          { error: 'Unauthorized - Super Admin only' },
          { status: 403 }
        );
      }
    } catch (error) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Trigger update
    console.log('🔄 Recalculating leaderboard rankings...');
    await updateLeaderboardRanking();

    // Clear Redis cache
    await deleteCachedValue(LEADERBOARD_CACHE_KEY);
    
    // Clear fallback cache
    leaderboardCacheFallback = null;
    leaderboardCacheTime = 0;

    console.log('✅ Leaderboard recalculated and cache cleared');

    return NextResponse.json({
      success: true,
      message: 'Leaderboard recalculated successfully',
      cacheCleared: true
    });

  } catch (error: any) {
    console.error('Error recalculating leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to recalculate leaderboard', details: error.message },
      { status: 500 }
    );
  }
}
