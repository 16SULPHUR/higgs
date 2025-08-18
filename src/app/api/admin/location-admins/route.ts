import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if user is admin
        const adminCheck = await fetch(`${process.env.BACKEND_URL}/admin/auth/me`, {
            headers: {
                'Authorization': `Bearer ${session.accessToken}`,
            },
        });

        if (!adminCheck.ok) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const response = await fetch(`${process.env.BACKEND_URL}/admin/location-admins`, {
            headers: {
                'Authorization': `Bearer ${session.accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch location admins');
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Error fetching location admins:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if user is admin
        const adminCheck = await fetch(`${process.env.BACKEND_URL}/admin/auth/me`, {
            headers: {
                'Authorization': `Bearer ${session.accessToken}`,
            },
        });

        if (!adminCheck.ok) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();

        const response = await fetch(`${process.env.BACKEND_URL}/admin/location-admins`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.accessToken}`,
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { error: errorData.message || 'Failed to create location admin' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 201 });

    } catch (error) {
        console.error('Error creating location admin:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

