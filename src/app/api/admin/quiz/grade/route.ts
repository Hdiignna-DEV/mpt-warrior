/**
 * API Route: /api/admin/quiz/grade
 * POST - Grade essay answer (SUPER_ADMIN only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateSuperAdmin } from '@/lib/middleware/auth';
import { gradeEssayAnswer } from '@/lib/db/education-service';
import { sendEssayGradedEmail } from '@/lib/email/resend-client';
import { getDatabase } from '@/lib/db/cosmos-client';

export async function POST(request: NextRequest) {
  try {
    // Verify SUPER_ADMIN role
    const { decoded, error } = validateSuperAdmin(request);
    if (error) {
      return error;
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
      decoded!.userId,
      decoded!.role
    );

    // Send email notification to user
    try {
      const database = getDatabase();
      const usersContainer = database.container('users');
      const questionsContainer = database.container('quiz-questions');
      
      // Get user details
      const { resource: user } = await usersContainer.item(userId, userId).read();
      
      // Get question details for module info
      const { resource: question } = await questionsContainer.item(questionId, questionId).read();
      
      if (user && user.email && question) {
        const moduleTitle = question.moduleId === 'module-1' ? 'The Warrior Mindset' :
                           question.moduleId === 'module-2' ? 'The Shield (Risk Management)' :
                           question.moduleId === 'module-3' ? 'The Map (Technical Analysis)' :
                           'Module';
        
        await sendEssayGradedEmail(
          user.email,
          user.name,
          moduleTitle,
          score,
          question.points || 10,
          feedback || ''
        );
        console.log('📧 Essay graded email sent to:', user.email);
      }
    } catch (emailError) {
      // Don't fail the grading if email fails
      console.error('Failed to send email notification:', emailError);
    }

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
