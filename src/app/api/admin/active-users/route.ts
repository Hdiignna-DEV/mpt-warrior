/**
 * Admin API: Get Active Users
 */

import { NextRequest, NextResponse } from 'next/server';
import { getActiveUsers } from '@/lib/db/user-service';
import { validateAdmin } from '@/lib/middleware/auth';

export async function GET(request: NextRequest) {
  try {
    // Validate admin access
    const { decoded, error } = validateAdmin(request);
    if (error) return error;

    // Get active users (filtered by admin role)
    const users = await getActiveUsers(decoded!.role);

    return NextResponse.json({
      success: true,
      users,
      count: users.length,
    });
  } catch (error: any) {
    console.error('Error fetching active users:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
