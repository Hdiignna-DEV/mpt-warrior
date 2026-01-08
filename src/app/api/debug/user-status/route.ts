/**
 * DEBUG ENDPOINT: Get current user status from token
 * Temporarily available for troubleshooting
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getUserById } from '@/lib/db/user-service';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing authorization header' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(request);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get fresh user data from DB
    const user = await getUserById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      debug: {
        tokenData: {
          userId: decoded.userId,
          email: decoded.email,
          role: decoded.role,
          status: decoded.status,
        },
        databaseUser: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
          createdAt: user.createdAt,
          approved_by: user.approved_by,
          approved_date: user.approved_date,
        },
        issues: {
          tokenStatusMismatch: decoded.status !== user.status,
          userNotActive: user.status !== 'active',
          userPending: user.status === 'pending',
          userRejected: user.status === 'rejected',
          userSuspended: user.status === 'suspended',
        }
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
