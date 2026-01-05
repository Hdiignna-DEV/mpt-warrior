/**
 * Admin API: Reject User
 */

import { NextRequest, NextResponse } from 'next/server';
import { rejectUser } from '@/lib/db/user-service';
import { validateAdmin } from '@/lib/middleware/auth';

export async function POST(request: NextRequest) {
  try {
    // Validate admin access
    const { decoded, error } = validateAdmin(request);
    if (error) return error;

    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Reject user (with role-based permission check)
    await rejectUser(userId, decoded!.email, decoded!.role);

    return NextResponse.json({
      success: true,
      message: 'User rejected successfully',
    });
  } catch (error: any) {
    console.error('Error rejecting user:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
