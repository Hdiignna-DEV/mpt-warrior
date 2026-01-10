import { NextRequest, NextResponse } from 'next/server';
import { quizGradingService } from '@/services/quizGradingService';

/**
 * POST /api/ai/quiz/grade
 * Grade a quiz answer using AI (Gemini or Groq)
 * 
 * Body:
 * - questionId: string
 * - question: string
 * - studentAnswer: string
 * - expectedAnswer?: string
 * - rubric?: string
 * - maxPoints: number
 * - provider: 'gemini' | 'groq'
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
      questionId,
      question,
      studentAnswer,
      expectedAnswer,
      rubric,
      maxPoints,
      provider,
    } = body;

    // Validate required fields
    if (!questionId || !question || !studentAnswer || !maxPoints || !provider) {
      return NextResponse.json(
        {
          error: 'Missing required fields: questionId, question, studentAnswer, maxPoints, provider',
        },
        { status: 400 }
      );
    }

    if (!['gemini', 'groq'].includes(provider)) {
      return NextResponse.json(
        { error: 'Invalid provider. Must be gemini or groq' },
        { status: 400 }
      );
    }

    // Grade the answer
    const gradingResult = await quizGradingService.grade({
      questionId,
      question,
      studentAnswer,
      expectedAnswer,
      rubric,
      maxPoints,
      provider,
    });

    return NextResponse.json({
      success: true,
      data: gradingResult,
    });
  } catch (error) {
    console.error('[API] Error grading quiz:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Check for API key issues
    if (
      errorMessage.includes('API key') ||
      errorMessage.includes('not initialized')
    ) {
      return NextResponse.json(
        { error: 'AI service not configured. Check API keys.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to grade answer: ' + errorMessage },
      { status: 500 }
    );
  }
}
