import { NextRequest, NextResponse } from 'next/server';

/**
 * MAINTENANCE MODE MIDDLEWARE
 * Implements role-based access control for mobile migration phase
 * - Public/Member (WARRIOR): Redirected to /maintenance-migration
 * - Admin/SuperAdmin: Full access maintained
 */

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Routes that bypass maintenance mode
  const bypassRoutes = [
    '/maintenance-migration',
    '/login',
    '/register',
    '/api/auth',
    '/service-worker.js',
    '/_next',
    '/public',
  ];

  // Check if route should bypass maintenance
  const shouldBypass = bypassRoutes.some(route => pathname.startsWith(route));
  if (shouldBypass) {
    return NextResponse.next();
  }

  // Get user from cookie/localStorage (passed via header)
  const userHeader = request.headers.get('x-user-role');
  const tokenCookie = request.cookies.get('mpt_token')?.value;

  // If user is not authenticated, let them through to login
  if (!tokenCookie) {
    return NextResponse.next();
  }

  // If user is not admin, redirect to maintenance
  const userRole = userHeader;
  if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
    const maintenanceUrl = new URL('/maintenance-migration', request.url);
    return NextResponse.redirect(maintenanceUrl);
  }

  // Admin bypass - allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except static assets
    '/((?!_next/static|_next/image|favicon.ico|manifest.json).*)',
  ],
};
