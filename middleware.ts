import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Redirect root "/" to /download since root page.tsx isn't being built by Turbopack
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/download', request.url));
  }

  // Redirect /get-app to /download
  if (pathname === '/get-app') {
    return NextResponse.redirect(new URL('/download', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/get-app'],
};
