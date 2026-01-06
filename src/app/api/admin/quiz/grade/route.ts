/**
 * API Route: /api/admin/quiz/grade
 * POST - Grade essay answer (SUPER_ADMIN only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireSuperAdminRole } from '@/lib/middleware/auth';
import { gradeEssayAnswer } from '@/lib/db/education-service';

export async function POST(request: NextRequest) {
  try {
    // Verify SUPER_ADMIN role
    const authResult = await requireSuperAdminRole(request);
    if (authResult instanceof Response) {
      return authResult;
    }

    const { userId, questionId, score, feedback } = await request.json();

    if (!userId || !questionId || score === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate score
    if (score < 0 || score > 100) {
      return NextResponse.json(
        { error: 'Score must be between 0 and 100' },
        { status: 400 }
      );
    }

    // Grade the essay
    const gradedAnswer = await gradeEssayAnswer(
      userId,
      questionId,
      score,
      feedback || '',
      authResult.userId,
      authResult.role
    );

    return NextResponse.json({
      success: true,
      answer: gradedAnswer,
      message: 'Answer graded successfully',
    });

  } catch (error: any) {
    console.error('Error grading answer:', error);
    
    // Check for permission error
    if (error.message.includes('SUPER_ADMIN')) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to grade answer', details: error.message },
      { status: 500 }
    );
  }
}
