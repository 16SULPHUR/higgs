import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { getCookies, setCookie } from 'cookies-next';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  try {
    
    const backendRes = await fetch(`${baseUrl}/api/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!backendRes.ok) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const { admin, token } = await backendRes.json();

    
    const response = NextResponse.json({ user: admin, message: "Login successful" });
    
    setCookie('auth-token', token, {
        req,
        res: response,
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 60 * 60 * 24,
        path: '/',
    });
    
    return response;

  } catch (error) {
    console.error('Login proxy error:', error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
}