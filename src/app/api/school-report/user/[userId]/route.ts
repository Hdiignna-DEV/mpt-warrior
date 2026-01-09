/**
 * API Route: /api/school-report/user/[userId]
 * GET - Get user's school report with skill assessment
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getUserLeaderboardData } from '@/lib/db/education-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const decoded = await verifyToken(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId: targetUserId } = await params;

    // Users can only view their own report, admins can view anyone
    if (decoded.userId !== targetUserId && decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get user's leaderboard data (includes radar chart data)
    const userData = await getUserLeaderboardData(targetUserId);
    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Build school report response
    const report = {
      userId: targetUserId,
      userName: userData.userName,
      email: userData.email,
      badge: userData.badge,
      totalPoints: userData.totalPoints,
      quizPoints: userData.quizPoints,
      consistencyPoints: userData.consistencyPoints,
      communityPoints: userData.communityPoints,
      winRate: userData.winRate,
      rank: userData.rank,
      
      // Skill assessment from radar chart data
      skills: {
        technicalAnalysis: userData.radarChartData?.technicalAnalysis || 0,
        riskManagement: userData.radarChartData?.riskManagement || 0,
        tradingPsychology: userData.radarChartData?.psychology || 0,
        discipline: userData.radarChartData?.discipline || 0,
        knowledge: userData.radarChartData?.knowledge || 0
      },
      
      // Mentor notes (placeholder for now, can be extended)
      mentorNotes: 'Keep improving your consistency! Check the dashboard for detailed feedback.',
      
      // Generate timestamp
      generatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      report
    });

  } catch (error: any) {
    console.error('Error fetching school report:', error);
    return NextResponse.json(
      { error: 'Failed to fetch school report' },
      { status: 500 }
    );
  }
}
