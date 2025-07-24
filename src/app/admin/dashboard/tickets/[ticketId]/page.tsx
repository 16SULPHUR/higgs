'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api.client';
import { ArrowLeft, Loader2 } from 'lucide-react';
import UpdateStatusForm from '@/components/admin/tickets/UpdateStatusForm';
import styles from './AdminTicketDetailPage.module.css';

export default function AdminTicketDetailPage() {
    const params = useParams();
    const [ticket, setTicket] = useState<any>(null);
    const ticketId = params.ticketId as string;

    const fetchData = () => {
        api.get(`/api/admin/support-tickets/${ticketId}`).then(setTicket);
    };

    useEffect(() => {
        if (ticketId) fetchData();
    }, [ticketId]);

    if (!ticket) return <div className={styles.loadingState}><Loader2 className={styles.loaderIcon} /></div>;

    const formatDate = (d: string) => new Date(d).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' });

    return (
        <div>
            <a href="/admin/dashboard/tickets" className={styles.backButton}><ArrowLeft size={16} />Back to All Tickets</a>
            <div className={styles.header}>
                <div><h1 className={styles.subject}>Ticket #{ticket.id}: {ticket.subject}</h1><p className={styles.meta}>From: {ticket.user_name} ({ticket.user_email}) on {formatDate(ticket.created_at)}</p></div>
            </div>
            <div className={styles.grid}>
                <div className={styles.ticketBody}>
                    <div className={styles.section}><h2 className={styles.sectionTitle}>User's Message</h2><p className={styles.description}>{ticket.description}</p></div>
                    {ticket.response && (<div className={styles.section}><h2 className={styles.sectionTitle}>Admin's Response</h2><div className={styles.responseBlock}><p>{ticket.response}</p></div></div>)}
                </div>
                <aside className={styles.sidebar}>
                    <UpdateStatusForm ticket={ticket} onUpdate={fetchData} />
                </aside>
            </div>
        </div>
    );
}