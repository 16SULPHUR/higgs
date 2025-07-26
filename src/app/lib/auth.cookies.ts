import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

const ACCESS_TOKEN_MAX_AGE = 15 * 60; 
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60;

const cookieOptions = (maxAge: number, path: string = '/') => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: path,
    maxAge: maxAge,
});

export function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(';').shift();
  return undefined;
}

export function setAuthCookies(response: NextResponse, accessToken: string, refreshToken: string) {
    response.cookies.set(ACCESS_TOKEN_KEY, accessToken, cookieOptions(ACCESS_TOKEN_MAX_AGE));
    response.cookies.set(REFRESH_TOKEN_KEY, refreshToken, cookieOptions(REFRESH_TOKEN_MAX_AGE, '/api/auth/refresh'));
}

export async function getAuthCookies() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(ACCESS_TOKEN_KEY)?.value;
    const refreshToken = cookieStore.get(REFRESH_TOKEN_KEY)?.value;
    return { accessToken, refreshToken };
}

export function clearAuthCookies(response: NextResponse) {
    response.cookies.set(ACCESS_TOKEN_KEY, '', { ...cookieOptions(0), maxAge: -1 });
    response.cookies.set(REFRESH_TOKEN_KEY, '', { ...cookieOptions(0, '/api/auth/refresh'), maxAge: -1 });
}