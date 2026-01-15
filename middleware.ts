import { NextRequest, NextResponse } from 'next/server';

/**
 * Minimal Middleware - Routes all requests through without blocking
 * Auth checks are delegated to client components and API routes
 * This avoids Next.js 16 routing issues with dynamic pages
 */

export async function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [], // Empty matcher = middleware not invoked
};
