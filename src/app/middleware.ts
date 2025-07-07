import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';


const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (pathname.startsWith('/admin')) {
      
        const adminToken = await getToken({ 
            req, 
            secret,
            
        });
        
        if (!adminToken && !pathname.startsWith('/admin/login')) {
            return NextResponse.redirect(new URL('/admin/login', req.url));
        }
        if (adminToken && pathname.startsWith('/admin/login')) {
            return NextResponse.redirect(new URL('/admin/dashboard', req.url));
        }

    } else if (pathname.startsWith('/dashboard')) {
      
        const userToken = await getToken({ req, secret });

        if (!userToken && !pathname.startsWith('/login')) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/login'],
};