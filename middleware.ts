import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const maintenanceMode = process.env.MAINTENANCE_MODE === 'true';

  // Redirect root "/" to /download
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/download', request.url));
  }

  // Redirect /get-app to /download
  if (pathname === '/get-app') {
    return NextResponse.redirect(new URL('/download', request.url));
  }

  // Skip middleware for static files and public routes
  if (pathname.startsWith('/_next') || pathname.includes('.') || pathname.startsWith('/public')) {
    return NextResponse.next();
  }

  // Public routes that don't need authentication
  const publicRoutes = ['/download', '/login', '/register', '/pending-approval', '/maintenance'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  const isApiRoute = pathname.startsWith('/api/');

  if (isPublicRoute || isApiRoute) {
    return NextResponse.next();
  }

  // Get token from cookie
  const token = request.cookies.get('token')?.value;

  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Verify and decode token
    const secret = JWT_SECRET;
    const verified = await jwtVerify(token, secret);
    const userRole = (verified.payload as any).role;

    // If maintenance mode is ON and user is not ADMIN/SUPER_ADMIN
    if (maintenanceMode && userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      // Redirect regular users to maintenance page
      if (!pathname.startsWith('/maintenance')) {
        return NextResponse.redirect(new URL('/maintenance', request.url));
      }
    }

    // Admin/Super_Admin can bypass maintenance mode
    return NextResponse.next();
  } catch (error) {
    // Invalid token - redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|downloads|public).*)',
  ],
};
