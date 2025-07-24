'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { api } from '@/lib/api.client';
import { Plus, Loader2 } from 'lucide-react'; 
import styles from '../rooms/RoomsPage.module.css'
import EventList from '@/components/events/EventList';

export default function EventsPage() {
    const { status } = useSession();
    const [events, setEvents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEvents = async () => {
        setIsLoading(true);
        try {
            const data = await api.get('/api/admin/events');
            setEvents(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (status === 'authenticated') {
            fetchEvents();
        }
    }, [status]);

    const renderContent = () => {
        if (isLoading || status === 'loading') {
            return <div className={styles.loadingState}><Loader2 className={styles.loaderIcon} /></div>;
        }
        if (error) {
            return <p>Error: {error}</p>;
        }
        return <EventList events={events} onUpdate={fetchEvents} />;
    };

    return (
        <div>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Community Events</h1>
                    <p className={styles.description}>Create and manage events for your members.</p>
                </div>
                <a href="/admin/dashboard/events/new" className={styles.addButton}>
                    <Plus size={16} />
                    <span>Create Event</span>
                </a>
            </div>
            {renderContent()}
        </div>
    );
}