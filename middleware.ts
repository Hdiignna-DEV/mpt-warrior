import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || '33bd8a08f87cbebc4c4d39cbf23de954420f59374d024eda9cf574db20fab4b0';

// ==========================================
// FULL GATEKEEPING SYSTEM
// Landing page ONLY untuk publik
// Semua fitur LOCKED untuk members
// ==========================================

// Public routes (Landing page + Auth pages ONLY - no login required)
const PUBLIC_ROUTES = [
  '/', 
  '/login', 
  '/register', 
  '/pending-approval', 
  '/access-denied',
];

// Admin-only routes (Server-side role check)
const ADMIN_ROUTES = ['/admin-hq'];

// Super Admin-only routes (Server-side role check)
const SUPER_ADMIN_ROUTES = ['/admin-hq/settings'];

// Protected routes - ALL FEATURES LOCKED (members only)
const PROTECTED_ROUTES = [
  '/dashboard',         // Main dashboard
  '/ai-mentor',         // AI Mentor (Gemini API - biaya)
  '/journal',           // Trading Journal
  '/calculator',        // Risk Calculator  
  '/achievements',      // Achievements
  '/analytics',         // Analytics Dashboard
  '/tutorial',          // The MPT Way (PDF Module)
  '/academy',           // Warrior Academy (Education Hub)
];

// Middleware untuk auth dan security

export async function middleware(request: NextRequest) {
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
  // LAYER 2: Public Routes (Landing + Auth only)
  // ============================================
  if (PUBLIC_ROUTES.includes(pathname) || pathname.startsWith('/_next') || pathname.startsWith('/api/auth')) {
    return response;
  }

  // ============================================
  // LAYER 3: GATEKEEPING - Get User Token
  // ============================================
  let user: any = null;
  const token = request.cookies.get('token')?.value;
  if (!token) {
    console.log('[MPT-MW] NO TOKEN, redirect to /login. Path:', pathname);
    return NextResponse.redirect(new URL('/login', request.url));
  }
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    user = payload;
  } catch (error) {
    console.log('[MPT-MW] INVALID TOKEN (jose), redirect to /login. Path:', pathname, 'Token:', token, 'Error:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
  console.log('[MPT-MW] TOKEN OK (jose). Path:', pathname, 'User:', user);

  // ============================================
  // LAYER 4: Role-Based Access Control
  // ============================================
  
  // Check Super Admin routes first (most restrictive)
  if (SUPER_ADMIN_ROUTES.some(route => pathname.startsWith(route))) {
    if (user.role !== 'SUPER_ADMIN') {
      console.log('[MPT-MW] SUPER_ADMIN route blocked. User role:', user.role, 'Path:', pathname);
      return NextResponse.redirect(new URL('/access-denied', request.url));
    }
    console.log('[MPT-MW] SUPER_ADMIN access granted. Path:', pathname);
    return response;
  }

  // Check Admin routes (ADMIN or SUPER_ADMIN)
  if (ADMIN_ROUTES.some(route => pathname.startsWith(route))) {
    if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      console.log('[MPT-MW] ADMIN route blocked. User role:', user.role, 'Path:', pathname);
      return NextResponse.redirect(new URL('/access-denied', request.url));
    }
    console.log('[MPT-MW] ADMIN access granted. Role:', user.role, 'Path:', pathname);
    return response;
  }

  // ============================================
  // LAYER 5: Protected Routes (Active Users Only)
  // ============================================
  if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    console.log('[MPT-MW] Protected route check:', {
      path: pathname,
      userStatus: user.status,
      userRole: user.role,
      isActive: user.status === 'active',
    });
    
    if (user.status !== 'active') {
      console.log('[MPT-MW] User not active, redirecting to pending-approval. Status:', user.status);
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
