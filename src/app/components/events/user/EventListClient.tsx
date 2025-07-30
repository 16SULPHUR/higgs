'use client';

import { useState } from 'react';
import EventList from './EventList';
import { api } from '@/lib/api.client';
import { useSessionContext } from '@/contexts/SessionContext';

export default function EventListClient({ initialEvents }: { initialEvents: any[] }) {
    const [events, setEvents] = useState(initialEvents);
    const [error, setError] = useState<string | null>(null);
    const session = useSessionContext();

    const handleUpdate = async () => {
        if (!session) return;
        try {
            setError(null);
            const data = await api.get(session, '/api/events');
            setEvents(data);
        } catch (err: any) {
            setError(err.message || 'Failed to refresh events.');
        }
    };

    if (error) {
        return <div>Error refreshing events: {error}</div>
    }

    return <EventList events={events} onUpdate={handleUpdate} />;
}