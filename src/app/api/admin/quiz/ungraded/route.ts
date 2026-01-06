/**
 * API Route: /api/admin/quiz/ungraded
 * GET - Get all ungraded essay answers (SUPER_ADMIN only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateSuperAdmin } from '@/lib/middleware/auth';
import { getUngradedEssays } from '@/lib/db/education-service';

export async function GET(request: NextRequest) {
  try {
    // Verify SUPER_ADMIN role
    const { decoded, error } = validateSuperAdmin(request);
    if (error) {
      return error;
    }

    // Get all ungraded essays
    const ungradedEssays = await getUngradedEssays();

    return NextResponse.json({
      success: true,
      count: ungradedEssays.length,
      essays: ungradedEssays,
    });

  } catch (error: any) {
    console.error('Error fetching ungraded essays:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ungraded essays', details: error.message },
      { status: 500 }
    );
  }
}
