'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { api } from '@/lib/api.client';
import EventList from '@/components/events/user/EventList';
import styles from './EventsPage.module.css';

export default function UserEventsPage() {
    const { status } = useSession();
    const [events, setEvents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEvents = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await api.get('/api/events');
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
        } else if (status === 'unauthenticated') {
            setIsLoading(false);
        }
    }, [status]);

    const renderContent = () => {
        if (isLoading || status === 'loading') {
            return <div className={styles.loadingState}><Loader2 className={styles.loaderIcon} /></div>;
        }
        if (error) {
            return <div className={styles.errorState}>Error: {error}</div>;
        }
        return <EventList events={events} onUpdate={fetchEvents} />;
    };

    return (
        <div className={styles.container}>
            <a href="/dashboard" className={styles.backButton}>
                <ArrowLeft size={16} />
                <span>Back to Dashboard</span>
            </a>
            <div className={styles.header}>
                <h1 className={styles.title}>Community Events</h1>
                <p className={styles.description}>
                    Discover upcoming events and manage your registrations.
                </p>
            </div>
            {renderContent()}
        </div>
    );
}