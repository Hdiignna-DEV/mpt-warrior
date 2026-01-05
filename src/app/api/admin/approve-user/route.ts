/**
 * Admin API: Approve User
 */

import { NextRequest, NextResponse } from 'next/server';
import { approveUser } from '@/lib/db/user-service';
import { sendApprovalEmail } from '@/lib/email/resend-client';
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

    // Approve user (with role-based permission check)
    const updatedUser = await approveUser(userId, decoded!.email, decoded!.role);

    // Send approval email (non-blocking)
    if (updatedUser.email && updatedUser.name) {
      const emailResult = await sendApprovalEmail(updatedUser.email, updatedUser.name);
      if (emailResult.success) {
        console.log(`✅ Approval email sent to: ${updatedUser.email}`);
      } else {
        console.error(`❌ Failed to send approval email: ${emailResult.error}`);
        // Don't fail the approval if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'User approved successfully',
      user: updatedUser,
    });
  } catch (error: any) {
    console.error('Error approving user:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
