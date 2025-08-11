'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, User, UserSquare, Download } from 'lucide-react';
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

    const exportToCSV = () => {
        if (!data) return;
        
        const { members = [], guests = [] } = data.registrations;
        const allRegistrations = [
            ...members.map(m => ({ ...m, type: 'Member' })),
            ...guests.map(g => ({ ...g, type: 'Guest' }))
        ];
         
        const headers = ['Type', 'Name', 'Email'];
        const csvContent = [
            headers.join(','),
            ...allRegistrations.map(reg => 
                [reg.type, reg.name, reg.email]
                    .map(field => `"${field}"`)
                    .join(',')
            )
        ].join('\n');
         
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
         
        const eventTitle = data.eventTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'event_registrations';
        link.download = `${eventTitle}_registrations.csv`;
         
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

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
                    <div className={styles.headerActions}>
                        <p className={styles.description}>
                            A total of {totalRegistrations} people have registered for this event.
                        </p>
                        {totalRegistrations > 0 && (
                            <button 
                                onClick={exportToCSV}
                                className={styles.exportButton}
                            >
                                <Download size={16} />
                                <span>Export to CSV</span>
                            </button>
                        )}
                    </div>
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
            <a href="/admin/dashboard/events" className={styles.backButton}>
                <ArrowLeft size={16} />
                <span>Back to Events</span>
            </a >
            <h1 className={styles.title}>
                Registrations for "{data?.eventTitle || '...'}"
            </h1>
            {renderContent()}
        </div>
    );
}