import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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

        const response = await fetch(`${process.env.BACKEND_URL}/admin/location-admins/${params.id}`, {
            headers: {
                'Authorization': `Bearer ${session.accessToken}`,
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                return NextResponse.json({ error: 'Location admin not found' }, { status: 404 });
            }
            throw new Error('Failed to fetch location admin');
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Error fetching location admin:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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

        const response = await fetch(`${process.env.BACKEND_URL}/admin/location-admins/${params.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.accessToken}`,
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { error: errorData.message || 'Failed to update location admin' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Error updating location admin:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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

        const response = await fetch(`${process.env.BACKEND_URL}/admin/location-admins/${params.id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${session.accessToken}`,
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                return NextResponse.json({ error: 'Location admin not found' }, { status: 404 });
            }
            throw new Error('Failed to delete location admin');
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Error deleting location admin:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

