/**
 * API Route: /api/academy/quiz/submit
 * POST - Submit quiz answer (auto-grade or queue for manual grading)
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { submitQuizAnswer } from '@/lib/db/education-service';

export async function POST(request: NextRequest) {
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

    const { moduleId, questionId, answer } = await request.json();

    if (!moduleId || !questionId || answer === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Submit answer (auto-grades MC/TF, queues essay for manual grading)
    const userAnswer = await submitQuizAnswer(
      decoded.userId,
      moduleId,
      questionId,
      answer
    );

    return NextResponse.json({
      success: true,
      answer: userAnswer,
      message: userAnswer.score !== null 
        ? 'Answer submitted and graded' 
        : 'Answer submitted, pending manual grading',
    });

  } catch (error: any) {
    console.error('Error submitting answer:', error);
    return NextResponse.json(
      { error: 'Failed to submit answer', details: error.message },
      { status: 500 }
    );
  }
}
