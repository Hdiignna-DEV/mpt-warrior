/**
 * Admin API: Get Pending Users
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPendingUsers } from '@/lib/db/user-service';
import { validateAdmin } from '@/lib/middleware/auth';

export async function GET(request: NextRequest) {
  try {
    // Validate admin access
    const { decoded, error } = validateAdmin(request);
    if (error) return error;

    // Get pending users
    const users = await getPendingUsers();

    return NextResponse.json({
      success: true,
      users,
      count: users.length,
    });
  } catch (error: any) {
    console.error('Error fetching pending users:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
