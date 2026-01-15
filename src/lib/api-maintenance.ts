import { NextRequest, NextResponse } from 'next/server';

export interface UserToken {
  id: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'WARRIOR';
}

/**
 * Extract user from request headers
 * Used in API routes to check admin access
 */
export async function getUserFromRequest(request: NextRequest): Promise<UserToken | null> {
  try {
    // Try to get from auth header
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // In production, verify JWT token here
      const token = authHeader.substring(7);
      // TODO: Implement actual JWT verification
      // For now, just return parsed data from header
    }

    // Try to get from x-user header (alternative)
    const userHeader = request.headers.get('x-user');
    if (userHeader) {
      return JSON.parse(Buffer.from(userHeader, 'base64').toString());
    }

    return null;
  } catch (error) {
    console.error('Failed to get user from request:', error);
    return null;
  }
}

/**
 * Middleware untuk melindungi API routes hanya untuk admin
 */
export async function protectAdminRoute(request: NextRequest) {
  // In maintenance mode, only allow admin/superadmin
  const user = await getUserFromRequest(request);

  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return NextResponse.json(
      { 
        error: 'Unauthorized', 
        message: 'This API is only available during maintenance for administrators' 
      },
      { status: 403 }
    );
  }

  return null; // Allow request to proceed
}

/**
 * Check if user has admin access
 */
export function hasAdminAccess(role?: string): boolean {
  return role === 'ADMIN' || role === 'SUPER_ADMIN';
}
