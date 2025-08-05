'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, User, UserSquare } from 'lucide-react';
import { api } from '@/lib/api.client';
import { useSessionContext } from '@/contexts/SessionContext';
import styles from './EventRegistrationsPage.module.css';

export default function EventRegistrationsPage() {
    const params = useParams();
    const session = useSessionContext();
    
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    const eventId = params.id as string;

    useEffect(() => {
        if (session === undefined) {
            return;
        }

        if (session && eventId) {
            const fetchData = async () => {
                try {
                    const responseData = await api.get(session, `/api/admin/events/${eventId}/registrations`);
                    setData(responseData);
                } catch (err: any) {
                    setError(err.message || 'Failed to load registrations.');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchData();
        } else {
            setIsLoading(false);
        }
    }, [session, eventId]);

    const renderContent = () => {
        if (isLoading || session === undefined) {
            return <div className={styles.loadingState}><Loader2 className={styles.loaderIcon} /></div>;
        }
        if (error) {
            return <p>Error: {error}</p>;
        }
        if (data) {
            const { members = [], guests = [] } = data.registrations;
            const totalRegistrations = members.length + guests.length;

            return (
                <div>
                    <p className={styles.description}>
                        A total of {totalRegistrations} people have registered for this event.
                    </p>
                    <div className={styles.grid}>
                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}><User /> Members ({members.length})</h2>
                            <ul className={styles.memberList}>
                                {members.length > 0 ? (
                                    members.map((reg: any) => (
                                        <li key={reg.id} className={styles.memberItem}>
                                            <span>{reg.name}</span>
                                            <span className={styles.memberEmail}>{reg.email}</span>
                                        </li>
                                    ))
                                ) : (
                                    <p className={styles.noMembers}>No members have registered yet.</p>
                                )}
                            </ul>
                        </div>
                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}><UserSquare /> Guests ({guests.length})</h2>
                            <ul className={styles.memberList}>
                                {guests.length > 0 ? (
                                    guests.map((reg: any) => (
                                        <li key={reg.id} className={styles.memberItem}>
                                            <span>{reg.name}</span>
                                            <span className={styles.memberEmail}>{reg.email}</span>
                                        </li>
                                    ))
                                ) : (
                                    <p className={styles.noMembers}>No guests have registered yet.</p>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            );
        }
        return <p>Event not found.</p>;
    };

    return (
        <div>
            <Link href="/admin/dashboard/events" className={styles.backButton}>
                <ArrowLeft size={16} />
                <span>Back to Events</span>
            </Link>
            <h1 className={styles.title}>
                Registrations for "{data?.eventTitle || '...'}"
            </h1>
            {renderContent()}
        </div>
    );
}