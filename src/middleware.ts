import { NextRequest, NextResponse } from 'next/server';

function isAdminFromCookie(req: NextRequest): boolean {
  
  const accessToken = req.cookies.get('accessToken')?.value;
  if (!accessToken) return false;
  try {
    
    const payload = accessToken.split('.')[1];
    if (!payload) return false;
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString('utf8'));
    return decoded?.type === 'admin';
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const hasCustomAccessCookie = Boolean(req.cookies.get('accessToken')?.value);
  const isAuthenticated = hasCustomAccessCookie;
  const isAdmin = isAuthenticated && isAdminFromCookie(req);

  if (pathname.startsWith('/admin')) {
    const adminPublicPaths = ['/admin/login', '/admin/forgot-password'];
    const isAdminPublic = adminPublicPaths.some((p) => pathname.startsWith(p));

    if (!isAuthenticated && !isAdminPublic) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    
    if (isAuthenticated && !isAdmin && !isAdminPublic) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    if (isAuthenticated && isAdmin && pathname.startsWith('/admin/login')) {
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