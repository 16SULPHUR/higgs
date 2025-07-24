'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { api } from '@/lib/api.client'; 
import EventForm from '@/components/events/EventForm';

export default function EditEventPage() {
    const params = useParams();
    const { status } = useSession();
    const [event, setEvent] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const eventId = params.id as string;

    useEffect(() => {
        if (status === 'authenticated' && eventId) {
            const fetchEvent = async () => {
                try {
                    const data = await api.get(`/api/admin/events/${eventId}`);
                    setEvent(data);
                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchEvent();
        }
    }, [status, eventId]);

    const renderContent = () => {
        if (isLoading || status === 'loading') {
            return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Loader2 className="animate-spin" /></div>;
        }
        if (error) {
            return <p>Error: {error}</p>;
        }
        if (event) {
            return <EventForm initialData={event} />;
        }
        return <p>Event not found.</p>;
    };

    return (
        <div>
            <a href="/admin/dashboard/events" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', marginBottom: '1.5rem'}}>
                <ArrowLeft size={16} />
                Back to Events
            </a>
            <h1 style={{fontSize: '1.75rem', fontWeight: 700, marginBottom: '2rem'}}>
                Edit "{event ? event.title : 'Event'}"
            </h1>
            {renderContent()}
        </div>
    );
}