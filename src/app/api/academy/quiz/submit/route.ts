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

    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.warn('Quiz submit: Invalid JSON body');
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { moduleId, questionId, answer } = body;

    if (!moduleId || !questionId || answer === undefined || answer === null || answer === '') {
      console.warn('Quiz submit: Missing fields', { moduleId, questionId, hasAnswer: answer !== undefined });
      return NextResponse.json(
        { error: 'Missing required fields: moduleId, questionId, answer' },
        { status: 400 }
      );
    }

    console.log(`📝 Quiz submit: User ${decoded.userId}, Module ${moduleId}, Question ${questionId}`);

    // Submit answer (auto-grades MC/TF, queues essay for manual grading)
    let userAnswer;
    try {
      userAnswer = await submitQuizAnswer(
        decoded.userId,
        moduleId,
        questionId,
        answer
      );
    } catch (error: any) {
      console.error(`❌ Error submitting answer:`, error.message);
      return NextResponse.json(
        { 
          error: 'Failed to submit answer', 
          details: error.message,
        },
        { status: 500 }
      );
    }

    console.log(`✅ Quiz answer submitted successfully for question ${questionId}`);

    return NextResponse.json({
      success: true,
      answer: userAnswer,
      message: userAnswer.score !== null 
        ? `Answer submitted and graded: ${userAnswer.score} points`
        : 'Answer submitted, pending manual grading',
    });

  } catch (error: any) {
    console.error('❌ Error in quiz submit route:', error.message, error.stack);
    return NextResponse.json(
      { 
        error: 'Failed to submit answer', 
        details: error.message,
        type: error.constructor.name 
      },
      { status: 500 }
    );
  }
}
