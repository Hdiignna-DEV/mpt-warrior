/**
 * API Route: /api/admin/quiz/ungraded
 * GET - Get all ungraded essay answers (SUPER_ADMIN only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateSuperAdmin } from '@/lib/middleware/auth';
import { getUngradedEssays } from '@/lib/db/education-service';
import { getUserById } from '@/lib/db/user-service';

export async function GET(request: NextRequest) {
  try {
    // Verify SUPER_ADMIN role
    const { decoded, error } = validateSuperAdmin(request);
    if (error) {
      return error;
    }

    // Get all ungraded essays
    const ungradedEssays = await getUngradedEssays();

    // Transform data for frontend with user info
    const transformedEssays = await Promise.all(
      ungradedEssays.map(async ({ question, answer }) => {
        // Fetch user info to get full name
        const user = await getUserById(answer.userId);
        
        return {
          id: `${answer.userId}-${answer.questionId}`, // Unique ID per user-question combination
          userId: answer.userId,
          userName: user?.name || answer.userId, // Use actual name or fallback to userId
          questionId: answer.questionId,
          moduleId: answer.moduleId,
          questionText: question.question,
          questionPoints: question.points,
          userAnswer: answer.answer,
          submittedAt: answer.submittedAt,
        };
      })
    );

    return NextResponse.json({
      success: true,
      count: transformedEssays.length,
      essays: transformedEssays,
    });

  } catch (error: any) {
    console.error('Error fetching ungraded essays:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ungraded essays', details: error.message },
      { status: 500 }
    );
  }
}
