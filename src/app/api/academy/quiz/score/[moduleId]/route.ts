/**
 * API Route: /api/academy/quiz/score/[moduleId]
 * GET - Get user's quiz score for a module
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getUserQuizScore, getUserQuizAnswers } from '@/lib/db/education-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = await verifyToken(request);

    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { moduleId } = await params;

    // Get quiz score
    const score = await getUserQuizScore(decoded.userId, moduleId);
    
    // Get user's answers with questions
    const answers = await getUserQuizAnswers(decoded.userId, moduleId);

    return NextResponse.json({
      success: true,
      score,
      answers,
    });

  } catch (error: any) {
    console.error('Error fetching quiz score:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz score', details: error.message },
      { status: 500 }
    );
  }
}
