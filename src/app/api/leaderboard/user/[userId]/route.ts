/**
 * API Route: /api/leaderboard/user/[userId]
 * GET - Get user ranking data with detailed stats
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getUserLeaderboardData } from '@/lib/db/education-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { userId } = await params;

    // Only allow users to view their own data, or admins to view any
    if (decoded.userId !== userId && decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const userData = await getUserLeaderboardData(userId);

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: userData
    });

  } catch (error: any) {
    console.error('Error fetching user leaderboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data', details: error.message },
      { status: 500 }
    );
  }
}
