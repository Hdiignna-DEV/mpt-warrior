/**
 * API Middleware Utilities
 * Centralized auth and status validation for API routes
 */

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface DecodedToken {
  userId: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'WARRIOR';
  status: 'active' | 'pending' | 'suspended' | 'rejected';
}

/**
 * Verify JWT token and return decoded payload
 * @throws Error if token is invalid or missing
 */
export function verifyToken(request: NextRequest): DecodedToken {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized: No token provided');
  }

  const token = authHeader.substring(7);
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    return decoded;
  } catch (error) {
    throw new Error('Unauthorized: Invalid token');
  }
}

/**
 * Verify user status is active
 * Returns 403 if user is not active (pending/suspended/rejected)
 */
export function requireActiveStatus(decoded: DecodedToken): NextResponse | null {
  if (decoded.status !== 'active') {
    return NextResponse.json(
      { 
        error: 'Account not active',
        status: decoded.status,
        message: decoded.status === 'pending' 
          ? 'Your account is pending approval' 
          : decoded.status === 'suspended'
          ? 'Your account has been suspended'
          : 'Your account has been rejected'
      },
      { status: 403 }
    );
  }
  
  return null; // No error, user is active
}

/**
 * Verify user has admin role
 * Returns 403 if user is not admin
 */
export function requireAdminRole(decoded: DecodedToken): NextResponse | null {
  if (decoded.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Forbidden: Admin access required' },
      { status: 403 }
    );
  }
  
  return null; // No error, user is admin
}

/**
 * Combined middleware: Verify token + active status
 * Returns error response if validation fails, null otherwise
 * 
 * Usage:
 * ```typescript
 * const { decoded, error } = validateActiveUser(request);
 * if (error) return error;
 * // Continue with decoded token
 * ```
 */
export function validateActiveUser(request: NextRequest): {
  decoded?: DecodedToken;
  error?: NextResponse;
} {
  try {
    const decoded = verifyToken(request);
    const statusError = requireActiveStatus(decoded);
    
    if (statusError) {
      return { error: statusError };
    }
    
    return { decoded };
  } catch (error: any) {
    return {
      error: NextResponse.json(
        { error: error.message || 'Unauthorized' },
        { status: 401 }
      ),
    };
  }
}

/**
 * Combined middleware: Verify token + active status + admin role
 * Returns error response if validation fails, null otherwise
 * 
 * Usage:
 * ```typescript
 * const { decoded, error } = validateAdmin(request);
 * if (error) return error;
 * // Continue with decoded admin token
 * ```
 */
export function validateAdmin(request: NextRequest): {
  decoded?: DecodedToken;
  error?: NextResponse;
} {
  try {
    const decoded = verifyToken(request);
    const statusError = requireActiveStatus(decoded);
    
    if (statusError) {
      return { error: statusError };
    }
    
    const roleError = requireAdminRole(decoded);
    
    if (roleError) {
      return { error: roleError };
    }
    
    return { decoded };
  } catch (error: any) {
    return {
      error: NextResponse.json(
        { error: error.message || 'Unauthorized' },
        { status: 401 }
      ),
    };
  }
}
