/**
 * API Route: /api/academy/quiz/[moduleId]
 * GET - Get quiz questions for a module
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getQuizQuestions } from '@/lib/db/education-service';

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

    // Get quiz questions (without correct answers for non-admins)
    const questions = await getQuizQuestions(moduleId);

    // Remove correct answers from response (security)
    const sanitizedQuestions = questions.map(q => ({
      id: q.id,
      moduleId: q.moduleId,
      type: q.type,
      question: q.question,
      options: q.options,
      points: q.points,
      order: q.order,
      // correctAnswer is NOT sent to client
    }));

    return NextResponse.json({
      success: true,
      questions: sanitizedQuestions,
    });

  } catch (error: any) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz', details: error.message },
      { status: 500 }
    );
  }
}
