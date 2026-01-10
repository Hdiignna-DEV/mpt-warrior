/**
 * API Route: /api/academy/quiz/score/[moduleId]
 * GET - Get user's quiz score for a module
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getUserQuizScore, getUserQuizAnswers } from '@/lib/db/education-service';
import { initializeContainers } from '@/lib/db/cosmos-client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  try {
    // Ensure containers exist
    try {
      await initializeContainers();
    } catch (initError) {
      console.error('[GET /api/academy/quiz/score] Container initialization warning:', initError);
    }

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
    
    if (!moduleId) {
      return NextResponse.json({ error: 'Missing moduleId parameter' }, { status: 400 });
    }

    // Get quiz score
    let score;
    let answers: Array<{ question: any; answer: any | null }> = [];
    
    try {
      score = await getUserQuizScore(decoded.userId, moduleId);
    } catch (error) {
      console.error(`Failed to get quiz score for module ${moduleId}:`, error);
      return NextResponse.json(
        { error: 'Failed to get quiz score', details: error instanceof Error ? error.message : 'Unknown error' },
        { status: 500 }
      );
    }
    
    // Get user's answers with questions
    try {
      answers = await getUserQuizAnswers(decoded.userId, moduleId);
    } catch (error) {
      console.error(`Failed to get quiz answers for module ${moduleId}:`, error);
      // Continue without answers rather than failing completely
      answers = [];
    }

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
