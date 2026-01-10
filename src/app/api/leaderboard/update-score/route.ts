import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/leaderboard/update-score
 * Update a user's score in the leaderboard
 * Called after quiz completion or significant activity
 * 
 * Body:
 * - userId: string
 * - quizPercentage?: number (0-100)
 * - messagesThisWeek?: number
 * - currentStreak?: number (days)
 * - achievements?: string[]
 */
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      quizPercentage,
      messagesThisWeek,
      currentStreak,
      achievements,
    } = body;

    // Calculate score components
    // Quiz score: 0-40 points
    const quizScore = Math.min(
      40,
      Math.round(((quizPercentage || 0) / 100) * 40)
    );

    // Chat activity score: 0-30 points (1 message = 1 point)
    const chatActivityScore = Math.min(30, messagesThisWeek || 0);

    // Streak bonus: 0-20 points (each day = 0.5 points)
    const streakBonus = Math.min(20, Math.floor((currentStreak || 0) * 0.5));

    // Achievement bonus: 0-10 points (each achievement = 2 points)
    const achievementBonus = Math.min(10, (achievements?.length || 0) * 2);

    const totalScore = quizScore + chatActivityScore + streakBonus + achievementBonus;

    // Get current week
    const now = new Date();
    const d = new Date(
      Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
    );
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNumber = Math.ceil(
      ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
    );
    const period = `${now.getFullYear()}-W${String(weekNumber).padStart(2, '0')}`;

    // In a real implementation, save to Cosmos DB
    // For now, return calculated scores
    return NextResponse.json({
      success: true,
      data: {
        userId,
        quizScore,
        chatActivityScore,
        streakBonus,
        achievementBonus,
        totalScore,
        period,
        weekNumber,
      },
    });
  } catch (error) {
    console.error('[API] Error updating score:', error);
    return NextResponse.json(
      { error: 'Failed to update score' },
      { status: 500 }
    );
  }
}
