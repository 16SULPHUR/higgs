'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { api } from '@/lib/api.client';
import styles from './EventRegistrationsPage.module.css';

export default function EventRegistrationsPage() {
    const params = useParams();
    const { status } = useSession();
    const [event, setEvent] = useState<any>(null);
    const [registrations, setRegistrations] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const eventId = params.id as string;

    useEffect(() => {
      console.log('Fetching registrations for event:', eventId);
        if (status === 'authenticated' && eventId) {
            const fetchData = async () => {
                try {
                    const [eventData, regsData] = await Promise.all([
                        api.get(`/api/admin/events/${eventId}`),
                        api.get(`/api/admin/events/${eventId}/registrations`)
                    ]);
                    setEvent(eventData);
                    setRegistrations(regsData);
                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchData();
        }
    }, [status, eventId]);

    const renderContent = () => {
        if (isLoading || status === 'loading') {
            return <div className={styles.loadingState}><Loader2 className={styles.loaderIcon} /></div>;
        }
        if (error) {
            return <p>Error: {error}</p>;
        }
        if (event) {
            return (
                <div className={styles.card}>
                    <ul className={styles.memberList}>
                        {registrations.length > 0 ? (
                            registrations.map((reg: any) => (
                                <li key={reg.id} className={styles.memberItem}>
                                    <span>{reg.name}</span>
                                    <span className={styles.memberEmail}>{reg.email}</span>
                                </li>
                            ))
                        ) : (
                            <p className={styles.noMembers}>There are no registrations for this event yet.</p>
                        )}
                    </ul>
                </div>
            );
        }
        return <p>Event not found.</p>;
    };

    return (
        <div>
            <a href="/admin/dashboard/events" className={styles.backButton}>
                <ArrowLeft size={16} />
                <span>Back to Events</span>
            </a>
            <h1 className={styles.title}>Registrations for "{event?.title || '...'}"</h1>
            <p className={styles.description}>
                A total of {isLoading ? '...' : registrations.length} users have registered for this event.
            </p>
            {renderContent()}
        </div>
    );
}