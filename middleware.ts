import { NextRequest, NextResponse } from 'next/server';

/**
 * MAINTENANCE MODE MIDDLEWARE
 * Implements role-based access control for mobile migration phase
 */

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const maintenanceMode = process.env.MAINTENANCE_MODE === 'true';

  // Skip middleware for static files and Next.js internals
  if (pathname.startsWith('/_next') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // Public routes that don't need maintenance check
  const publicRoutes = [
    '/maintenance-migration',
    '/login',
    '/register',
    '/get-app',
    '/downloads',
  ];

  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  const isApiRoute = pathname.startsWith('/api/');

  // If maintenance mode is off, allow all
  if (!maintenanceMode) {
    return NextResponse.next();
  }

  // For public routes and API routes, allow without check
  if (isPublicRoute || isApiRoute) {
    return NextResponse.next();
  }

  // For other routes during maintenance, check authentication
  // This is handled client-side by MaintenanceModeGuard component
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
