import { NextRequest, NextResponse } from 'next/server';
import { deleteCookie } from 'cookies-next';

export async function POST(req: NextRequest) {
    const response = NextResponse.json({ message: 'Logout successful' });
    deleteCookie('auth-token', { req, res: response });
    return response;
}