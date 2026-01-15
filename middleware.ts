import { NextRequest, NextResponse } from 'next/server';

/**
 * MAINTENANCE MODE MIDDLEWARE
 * Implements role-based access control for mobile migration phase
 */

export function middleware(request: NextRequest) {
  // Temporarily disabled for debugging route generation issue
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
