/**
 * API Route: /api/leaderboard/auto-populate
 * POST - Auto-populate leaderboard if empty (no auth required for first init)
 * 
 * This endpoint:
 * 1. Checks if leaderboard is empty
 * 2. If empty, triggers population from existing user data
 * 3. Only works once (idempotent)
 */

import { NextRequest, NextResponse } from 'next/server';
import { updateLeaderboardRanking } from '@/lib/db/education-service';
import { getCosmosClient } from '@/lib/db/cosmos-client';

export async function POST(request: NextRequest) {
  try {
    const database = getCosmosClient().database('mpt-warrior');
    
    // Check if leaderboard already has data
    const leaderboardContainer = database.container('user-leaderboard');
    const { resources: existingData } = await leaderboardContainer.items
      .query({
        query: `SELECT VALUE COUNT(1) FROM c`
      })
      .fetchAll();

    const entryCount = existingData[0] || 0;

    if (entryCount > 0) {
      // Already populated
      return NextResponse.json({
        success: false,
        message: 'Leaderboard already populated',
        entryCount,
        alreadyPopulated: true
      });
    }

    // Check if there are active users to populate from
    const usersContainer = database.container('users');
    const { resources: userCount } = await usersContainer.items
      .query({
        query: `SELECT VALUE COUNT(1) FROM c WHERE c.status = 'active'`
      })
      .fetchAll();

    const activeUsers = userCount[0] || 0;

    if (activeUsers === 0) {
      return NextResponse.json({
        success: false,
        message: 'No active users to populate from',
        activeUsers: 0
      }, { status: 400 });
    }

    // Trigger population
    console.log('🚀 Auto-populating leaderboard from user data...');
    await updateLeaderboardRanking();

    // Verify
    const { resources: newData } = await leaderboardContainer.items
      .query({
        query: `SELECT VALUE COUNT(1) FROM c`
      })
      .fetchAll();

    const newEntryCount = newData[0] || 0;

    console.log(`✅ Auto-population complete: ${newEntryCount} entries created`);

    return NextResponse.json({
      success: true,
      message: 'Leaderboard auto-populated successfully',
      entriesCreated: newEntryCount,
      activeUsers,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Error auto-populating leaderboard:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Auto-populate failed',
        details: error.message
      },
      { status: 500 }
    );
  }
}
