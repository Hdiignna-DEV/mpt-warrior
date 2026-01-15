import { NextRequest, NextResponse } from 'next/server';

/**
 * MAINTENANCE MODE MIDDLEWARE
 * Implements role-based access control for mobile migration phase
 * 
 * NOTE: Maintenance mode check primarily happens client-side
 * Middleware here just allows requests through to client for rendering
 */

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Routes that always bypass maintenance check
  const publicRoutes = [
    '/maintenance-migration',
    '/login',
    '/register',
    '/api/auth',
    '/get-app',
    '/service-worker.js',
    '/_next',
  ];

  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  // Also allow static assets
  if (pathname.includes('.') && !pathname.endsWith('.tsx')) {
    return NextResponse.next();
  }

  // For all other routes, just pass through
  // Client-side MaintenanceModeGuard component will handle redirect
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except Next.js internals and static files
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|\..*|public).*)',
  ],
};
