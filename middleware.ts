import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const maintenanceMode = process.env.MAINTENANCE_MODE === 'true';

  // When maintenance mode is ON, allow root "/" to show landing page with documentation
  // When maintenance mode is OFF, redirect "/" to "/download"
  if (pathname === '/') {
    if (!maintenanceMode) {
      return NextResponse.redirect(new URL('/download', request.url));
    }
    // Maintenance mode ON: show landing page with documentation
    return NextResponse.next();
  }

  // Redirect /get-app to /download
  if (pathname === '/get-app') {
    return NextResponse.redirect(new URL('/download', request.url));
  }

  // Skip middleware for static files and public routes
  if (pathname.startsWith('/_next') || pathname.includes('.') || pathname.startsWith('/public')) {
    return NextResponse.next();
  }

  // Public routes that don't need authentication (always accessible)
  const publicRoutes = ['/download', '/login', '/register', '/pending-approval', '/maintenance'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // API routes handling - check token if maintenance mode is on
  const isApiRoute = pathname.startsWith('/api/');
  if (isApiRoute) {
    // If maintenance mode is OFF, API routes are freely accessible
    if (!maintenanceMode) {
      return NextResponse.next();
    }

    // If maintenance mode is ON, validate token for API access
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - Maintenance mode active' },
        { status: 401 }
      );
    }

    try {
      const verified = await jwtVerify(token, JWT_SECRET);
      const userRole = (verified.payload as any).role?.toUpperCase();

      // Only ADMIN and SUPER_ADMIN can access APIs during maintenance
      if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
        return NextResponse.json(
          { error: 'Forbidden - Admin only during maintenance' },
          { status: 403 }
        );
      }

      return NextResponse.next();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
  }

  // Public routes are always accessible
  if (isPublicRoute) {
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
    const verified = await jwtVerify(token, JWT_SECRET);
    const userRole = (verified.payload as any).role?.toUpperCase();

    // If maintenance mode is ON and user is not ADMIN/SUPER_ADMIN
    if (maintenanceMode && userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      // Redirect regular users to maintenance page
      if (!pathname.startsWith('/maintenance')) {
        return NextResponse.redirect(new URL('/maintenance', request.url));
      }
    }

    // Admin/Super_Admin can bypass maintenance mode and access all pages
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
