/**
 * API Route: /api/leaderboard
 * GET - Get leaderboard top users with caching (filters out admin/super admin)
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getLeaderboardTop, updateLeaderboardRanking } from '@/lib/db/education-service';
import { getCosmosClient } from '@/lib/db/cosmos-client';

// Simple in-memory cache (in production, use Redis)
let leaderboardCache: any = null;
let leaderboardCacheTime = 0;
const CACHE_TTL = 3600000; // 1 hour in milliseconds

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

    // Check cache
    const now = Date.now();
    if (leaderboardCache && (now - leaderboardCacheTime) < CACHE_TTL) {
      console.log('📦 Returning leaderboard from cache');
      return NextResponse.json({
        success: true,
        leaderboard: leaderboardCache.slice(offset, offset + limit),
        total: leaderboardCache.length,
        cached: true,
        cacheAge: now - leaderboardCacheTime
      });
    }

    // Cache miss - fetch from database and filter
    console.log('🔄 Fetching leaderboard from database');
    const allLeaderboard = await getLeaderboardTop(1000, 0);
    
    // Filter out admin users - get user roles from database
    const database = getCosmosClient().database('mpt-db');
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
    
    // Update cache
    leaderboardCache = filteredLeaderboard;
    leaderboardCacheTime = now;

    return NextResponse.json({
      success: true,
      leaderboard: filteredLeaderboard.slice(offset, offset + limit),
      total: filteredLeaderboard.length,
      cached: false
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
 * POST - Trigger manual leaderboard recalculation (Admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const decoded = await verifyToken(request);
    if (!decoded || decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized - Admin only' }, { status: 403 });
    }

    // Trigger update
    await updateLeaderboardRanking();

    // Clear cache
    leaderboardCache = null;
    leaderboardCacheTime = 0;

    return NextResponse.json({
      success: true,
      message: 'Leaderboard recalculated successfully'
    });

  } catch (error: any) {
    console.error('Error recalculating leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to recalculate leaderboard', details: error.message },
      { status: 500 }
    );
  }
}
