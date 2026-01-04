import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Public routes yang tidak perlu auth
const PUBLIC_ROUTES = ['/', '/login', '/register', '/pending-approval'];

// Admin-only routes
const ADMIN_ROUTES = ['/admin-hq'];

// Protected routes (perlu active status)
const PROTECTED_ROUTES = [
  '/dashboard',
  '/ai-mentor',
  '/journal',
  '/calculator',
  '/achievements',
  '/analytics',
  '/tutorial',
];

// Middleware untuk auth dan security
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ============================================
  // LAYER 1: Security Headers (semua routes)
  // ============================================
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  );

  // CORS headers untuk API routes
  if (pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_APP_URL || '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization'
    );
  }

  // ============================================
  // LAYER 2: Public Routes (skip auth check)
  // ============================================
  if (PUBLIC_ROUTES.includes(pathname) || pathname.startsWith('/_next') || pathname.startsWith('/api')) {
    return response;
  }

  // ============================================
  // LAYER 3: Get User Token from Cookie/Header
  // ============================================
  let user: any = null;
  
  // Try to get token from cookie (client-side)
  const token = request.cookies.get('mpt_token')?.value;
  
  if (token) {
    try {
      user = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      // Invalid token, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  } else {
    // No token, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // ============================================
  // LAYER 4: Admin Routes Protection
  // ============================================
  if (ADMIN_ROUTES.some(route => pathname.startsWith(route))) {
    if (user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/access-denied', request.url));
    }
    return response;
  }

  // ============================================
  // LAYER 5: Protected Routes (Active Users Only)
  // ============================================
  if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    if (user.status !== 'active') {
      return NextResponse.redirect(new URL('/pending-approval', request.url));
    }
    
    if (user.status === 'suspended') {
      return NextResponse.redirect(new URL('/suspended', request.url));
    }
    
    if (user.status === 'rejected') {
      return NextResponse.redirect(new URL('/rejected', request.url));
    }
  }

  // Request logging
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${new Date().toISOString()}] ${request.method} ${pathname} - User: ${user?.email || 'Anonymous'}`);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match semua request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
