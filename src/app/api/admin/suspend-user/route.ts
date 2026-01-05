/**
 * Admin API: Suspend User
 */

import { NextRequest, NextResponse } from 'next/server';
import { suspendUser } from '@/lib/db/user-service';
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

    // Suspend user
    const updatedUser = await suspendUser(userId, decoded!.email);

    return NextResponse.json({
      success: true,
      message: 'User suspended successfully',
      user: updatedUser,
    });
  } catch (error: any) {
    console.error('Error suspending user:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
