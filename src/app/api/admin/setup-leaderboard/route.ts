/**
 * API Route: /api/admin/setup-leaderboard
 * POST - Setup leaderboard containers (admin only, one-time setup)
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getCosmosClient } from '@/lib/db/cosmos-client';

export async function POST(request: NextRequest) {
  try {
    // Verify super admin access
    const decoded = await verifyToken(request);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized - Token required' },
        { status: 401 }
      );
    }

    // Check role from token (simplified - no DB lookup)
    if (decoded.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Super Admin access required' },
        { status: 403 }
      );
    }

    console.log('🚀 Starting leaderboard container setup...');
    console.log('User:', decoded.email, 'Role:', decoded.role);

    const client = getCosmosClient();
    const educationDb = client.database('mpt-warrior');

    const results = {
      userLeaderboard: { status: 'pending', message: '' },
      leaderboardHistory: { status: 'pending', message: '' }
    };

    // Create user-leaderboard container
    try {
      console.log('📦 Creating user-leaderboard container...');
      await educationDb.containers.createIfNotExists({
        id: 'user-leaderboard',
        partitionKey: '/userId',
        throughput: 100
      });
      results.userLeaderboard = {
        status: 'success',
        message: 'user-leaderboard container created (100 RU/s)'
      };
      console.log('✅ user-leaderboard container ready');
    } catch (error: any) {
      if (error.code === 409) {
        results.userLeaderboard = {
          status: 'success',
          message: 'user-leaderboard container already exists'
        };
        console.log('✅ user-leaderboard container already exists');
      } else {
        throw error;
      }
    }

    // Create leaderboard-history container
    try {
      console.log('📦 Creating leaderboard-history container...');
      await educationDb.containers.createIfNotExists({
        id: 'leaderboard-history',
        partitionKey: '/week',
        throughput: 100
      });
      results.leaderboardHistory = {
        status: 'success',
        message: 'leaderboard-history container created (100 RU/s)'
      };
      console.log('✅ leaderboard-history container ready');
    } catch (error: any) {
      if (error.code === 409) {
        results.leaderboardHistory = {
          status: 'success',
          message: 'leaderboard-history container already exists'
        };
        console.log('✅ leaderboard-history container already exists');
      } else {
        throw error;
      }
    }

    console.log('✅ Leaderboard setup complete');

    return NextResponse.json({
      success: true,
      message: 'Leaderboard containers setup complete',
      results,
      nextStep: 'Call POST /api/leaderboard to initialize rankings'
    });

  } catch (error: any) {
    console.error('❌ Setup failed:', error);
    return NextResponse.json(
      {
        error: 'Setup failed',
        details: error.message
      },
      { status: 500 }
    );
  }
}
