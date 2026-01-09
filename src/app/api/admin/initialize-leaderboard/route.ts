/**
 * API Route: /api/admin/initialize-leaderboard
 * POST - Initialize leaderboard rankings (Super Admin only, simplified)
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { updateLeaderboardRanking } from '@/lib/db/education-service';

export async function POST(request: NextRequest) {
  try {
    // Verify token exists
    const decoded = await verifyToken(request);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized - Token required' },
        { status: 401 }
      );
    }

    // Simple role check from token
    if (decoded.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Super Admin access required' },
        { status: 403 }
      );
    }

    console.log('🚀 Starting leaderboard initialization...');
    console.log('User:', decoded.email, 'Role:', decoded.role);

    // Call the update function
    await updateLeaderboardRanking();

    console.log('✅ Leaderboard initialized successfully');

    return NextResponse.json({
      success: true,
      message: 'Leaderboard initialized successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Error initializing leaderboard:', error);
    return NextResponse.json(
      {
        error: 'Failed to initialize leaderboard',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
