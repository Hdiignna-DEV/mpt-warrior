/**
 * API Route: /api/admin/setup-leaderboard
 * POST - Setup leaderboard containers (admin only, one-time setup)
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { updateLeaderboardRanking } from '@/lib/db/education-service';

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

    console.log('🚀 Starting leaderboard setup...');
    console.log('User:', decoded.email, 'Role:', decoded.role);

    // Simply initialize the leaderboard by calculating all rankings
    // This will automatically create containers if they don't exist
    console.log('📊 Initializing leaderboard rankings...');
    await updateLeaderboardRanking();

    console.log('✅ Leaderboard setup complete');

    return NextResponse.json({
      success: true,
      message: 'Leaderboard setup complete! Containers created and rankings initialized.',
      nextStep: 'View leaderboard at /leaderboard'
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
