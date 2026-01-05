/**
 * Admin API: Get Invitation Codes
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAllInvitationCodes } from '@/lib/db/code-service';
import { validateAdmin } from '@/lib/middleware/auth';

export async function GET(request: NextRequest) {
  try {
    // Validate admin access
    const { decoded, error } = validateAdmin(request);
    if (error) return error;

    // Get all invitation codes
    const codes = await getAllInvitationCodes();

    return NextResponse.json({
      success: true,
      codes,
      count: codes.length,
    });
  } catch (error: any) {
    console.error('Error fetching invitation codes:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
