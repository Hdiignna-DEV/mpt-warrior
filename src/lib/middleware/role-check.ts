/**
 * Role-Based Access Control Middleware
 * Protects API routes based on user roles
 */

import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { UserRole } from '@/types';
import { hasAdminAccess, hasSuperAdminAccess } from '@/lib/auth-config';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    role: UserRole;
    warriorId?: string;
  };
}

/**
 * Extract and verify JWT token from request
 */
export async function verifyToken(request: NextRequest): Promise<{
  valid: boolean;
  user?: {
    id: string;
    email: string;
    role: UserRole;
    warriorId?: string;
  };
  error?: string;
}> {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { valid: false, error: 'No token provided' };
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = verify(token, JWT_SECRET) as {
        id: string;
        email: string;
        role: UserRole;
        warriorId?: string;
      };

      return {
        valid: true,
        user: decoded
      };
    } catch (verifyError) {
      return { valid: false, error: 'Invalid token' };
    }
  } catch (error) {
    return { valid: false, error: 'Authentication failed' };
  }
}

/**
 * Middleware: Require authentication
 * Use for all protected routes
 */
export async function requireAuth(
  request: NextRequest,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  const { valid, user, error } = await verifyToken(request);

  if (!valid || !user) {
    return NextResponse.json(
      { error: error || 'Unauthorized' },
      { status: 401 }
    );
  }

  // Attach user to request
  const authenticatedRequest = request as AuthenticatedRequest;
  authenticatedRequest.user = user;

  return handler(authenticatedRequest);
}

/**
 * Middleware: Require admin access (ADMIN or SUPER_ADMIN)
 * Use for admin-only routes
 */
export async function requireAdmin(
  request: NextRequest,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  return requireAuth(request, async (req) => {
    const { user } = req;

    if (!user || !hasAdminAccess(user.role)) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    return handler(req);
  });
}

/**
 * Middleware: Require super admin access (SUPER_ADMIN only)
 * Use for super admin-only routes (settings, system config)
 */
export async function requireSuperAdmin(
  request: NextRequest,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  return requireAuth(request, async (req) => {
    const { user } = req;

    if (!user || !hasSuperAdminAccess(user.role)) {
      return NextResponse.json(
        { error: 'Super Admin access required' },
        { status: 403 }
      );
    }

    return handler(req);
  });
}

/**
 * Middleware: Require specific role
 * Use for custom role requirements
 */
export async function requireRole(
  request: NextRequest,
  allowedRoles: UserRole[],
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  return requireAuth(request, async (req) => {
    const { user } = req;

    if (!user || !allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { error: `Access denied. Required roles: ${allowedRoles.join(', ')}` },
        { status: 403 }
      );
    }

    return handler(req);
  });
}

/**
 * Helper: Check if user owns resource
 */
export function isResourceOwner(userId: string, resourceUserId: string): boolean {
  return userId === resourceUserId;
}

/**
 * Middleware: Require resource ownership or admin access
 * Use for user-specific resources (profile, trades, journal)
 */
export async function requireOwnershipOrAdmin(
  request: NextRequest,
  resourceUserId: string,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  return requireAuth(request, async (req) => {
    const { user } = req;

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const isOwner = isResourceOwner(user.id, resourceUserId);
    const isAdmin = hasAdminAccess(user.role);

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Access denied. You can only access your own resources.' },
        { status: 403 }
      );
    }

    return handler(req);
  });
}
