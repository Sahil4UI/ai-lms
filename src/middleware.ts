import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from './app/admin/actions';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply middleware to /admin routes
  if (pathname.startsWith('/admin')) {
    const session = await getSession();

    // If trying to access a protected admin route without being logged in, redirect to login
    if (!session.isLoggedIn && pathname !== '/admin/login') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // If logged in and trying to access the login page, redirect to dashboard
    if (session.isLoggedIn && pathname === '/admin/login') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/admin/login'],
};
