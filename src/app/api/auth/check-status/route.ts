/**
 * Check User Status API Route
 * Allow pending users to check if they've been approved
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/db/user-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email required' },
        { status: 400 }
      );
    }

    // Get user by email
    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Return current status (without password)
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        status: user.status,
        role: user.role,
        whatsapp: user.whatsapp,
        telegram_id: user.telegram_id,
      },
    });
  } catch (error: any) {
    console.error('Error checking status:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
