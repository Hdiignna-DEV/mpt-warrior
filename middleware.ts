import { NextRequest, NextResponse } from 'next/server';

/**
 * Minimal Middleware - Routes all requests through without blocking
 * Auth checks are delegated to client components and API routes
 */

export async function middleware(request: NextRequest) {
  // Allow all requests to pass through
  return NextResponse.next();
}

// Only match specific patterns if needed, otherwise leave empty
export const config = {
  matcher: [],
};
