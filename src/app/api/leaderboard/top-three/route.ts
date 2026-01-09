/**
 * API Route: /api/leaderboard/top-three
 * GET - Get top 3 users for dashboard widget
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getCosmosClient } from '@/lib/db/cosmos-client';
import { getCachedValue, setCachedValue } from '@/lib/cache/redis-cache';

const TOP_THREE_CACHE_KEY = 'leaderboard:top3:v1';
const CACHE_TTL = 300; // 5 minutes

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

    // Try cache first
    const cachedData = await getCachedValue(TOP_THREE_CACHE_KEY);
    
    if (cachedData) {
      return NextResponse.json({
        success: true,
        topThree: cachedData,
        cached: true,
      });
    }

    // Fetch from database
    const database = getCosmosClient().database('mpt-warrior');
    const usersContainer = database.container('users');

    // Query top 3 users ordered by totalPoints descending and currentRank ascending
    const { resources: topUsers } = await usersContainer.items
      .query<any>(
        `SELECT c.id, c.displayName, c.profileImage, c.email, 
                c.totalPoints, c.currentRank, c.tier, c.badges,
                c.weeklyPoints, c.pointsBreakdown
         FROM c 
         WHERE c.role = 'WARRIOR' AND c.totalPoints > 0
         ORDER BY c.totalPoints DESC, c.currentRank ASC
         OFFSET 0 LIMIT 3`
      )
      .fetchAll();

    const topThree = topUsers.map((user, index) => ({
      rank: index + 1,
      userId: user.id,
      displayName: user.displayName || user.email?.split('@')[0],
      profileImage: user.profileImage,
      totalPoints: user.totalPoints || 0,
      weeklyPoints: user.weeklyPoints || 0,
      tier: user.tier || 'RECRUIT',
      badges: user.badges || [],
      medal: ['🥇', '🥈', '🥉'][index] || '',
    }));

    // Cache for 5 minutes
    await setCachedValue(TOP_THREE_CACHE_KEY, topThree, CACHE_TTL);

    return NextResponse.json({
      success: true,
      topThree,
      cached: false,
    });

  } catch (error: any) {
    console.error('Error fetching top 3:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch top 3' },
      { status: 500 }
    );
  }
}
