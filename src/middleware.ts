import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const hasCustomAccessCookie = Boolean(req.cookies.get('accessToken')?.value); 
  const isAuthenticated = hasCustomAccessCookie

  if (pathname.startsWith('/admin')) {
    const adminPublicPaths = ['/admin/login', '/admin/forgot-password'];
    const isAdminPublic = adminPublicPaths.some((p) => pathname.startsWith(p));

    if (!isAuthenticated && !isAdminPublic) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    if (isAuthenticated && pathname.startsWith('/admin/login')) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }
  } else if (pathname.startsWith('/dashboard')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
};