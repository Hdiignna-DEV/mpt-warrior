import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || '';

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'WARRIOR' | 'FOUNDER';
  status: string;
  isFounder?: boolean;
}

/**
 * Verify JWT token from request cookies or Authorization header
 */
export async function verifyToken(request: NextRequest): Promise<JWTPayload | null> {
  try {
    // Try to get token from cookie first
    let token = request.cookies.get('token')?.value;

    // If not in cookie, try Authorization header
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return null;
    }

    // Verify and decode token
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;

  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

/**
 * Check if user is admin
 */
export async function requireAdmin(request: NextRequest): Promise<JWTPayload | Response> {
  const user = await verifyToken(request);

  if (!user) {
    return new Response(
      JSON.stringify({ success: false, message: 'Unauthorized - No valid token' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (user.role !== 'ADMIN') {
    return new Response(
      JSON.stringify({ success: false, message: 'Forbidden - Admin access required' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return user;
}