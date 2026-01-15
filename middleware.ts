import { NextRequest, NextResponse } from 'next/server';

/**
 * MAINTENANCE MODE MIDDLEWARE
 * Implements role-based access control for mobile migration phase
 * 
 * MAINTENANCE_MODE enabled: Only ADMIN & SUPER_ADMIN can access dashboard
 * All other users redirected to /maintenance-migration
 */

// Routes yang SELALU bisa diakses tanpa maintenance check
const PUBLIC_ROUTES = [
  '/maintenance-migration',
  '/login',
  '/register',
  '/api/auth',
  '/get-app',
  '/downloads',
  '/service-worker.js',
  '/api/quiz',
];

// Admin API routes yang tetap aktif saat maintenance
const PROTECTED_API_ROUTES = [
  '/api/admin',
  '/api/cosmos',
  '/api/dashboard',
];

// Routes yang HARUS di-proteksi (only admin access)
const PROTECTED_ROUTES = [
  '/dashboard',
  '/admin-hq',
  '/analytics',
  '/profile',
  '/modules',
  '/academy',
  '/leaderboard',
  '/achievements',
  '/journal',
  '/ai-mentor',
  '/calculator',
  '/school-report',
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const maintenanceMode = process.env.MAINTENANCE_MODE === 'true';

  // Static assets - selalu allow
  if (pathname.includes('.') && !pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Public routes - selalu allow
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route));
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Jika maintenance mode OFF, allow semua
  if (!maintenanceMode) {
    return NextResponse.next();
  }

  // MAINTENANCE MODE ON - Check role
  
  // Try to get token from cookies
  const token = request.cookies.get('mpt_token')?.value;
  const userRole = request.cookies.get('mpt_user_role')?.value;

  // API routes check
  if (pathname.startsWith('/api/')) {
    // Protected admin API - require token + admin role
    const isProtectedApi = PROTECTED_API_ROUTES.some(route => pathname.startsWith(route));
    
    if (isProtectedApi) {
      if (!token || (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN')) {
        return NextResponse.json(
          { error: 'Unauthorized - Maintenance Mode Active' },
          { status: 401 }
        );
      }
    }
    
    // Other API routes allowed
    return NextResponse.next();
  }

  // Protected page routes - require admin role
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute) {
    // No token = not logged in = redirect to login
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Token exists but not admin = redirect to maintenance
    if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/maintenance-migration', request.url));
    }

    // Is admin = allow
    return NextResponse.next();
  }

  // Other routes allowed
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except Next.js internals and static files
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|\..*|public).*)',
  ],
};
