/**
 * Admin API: Approve User
 */

import { NextRequest, NextResponse } from 'next/server';
import { approveUser } from '@/lib/db/user-service';
import { sendApprovalEmail } from '@/lib/email/resend-client';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    // Verify admin token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded: any = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Approve user
    const updatedUser = await approveUser(userId, decoded.email);

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
