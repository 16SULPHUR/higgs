import { api } from '@/lib/apiClient';
import Link from 'next/link';
import { ArrowLeft, Trash2 } from 'lucide-react';
import styles from './TicketDetailPage.module.css';
import { deleteTicketAction } from '@/actions/usersTicketActions';

export default async function TicketDetailPage({ params }: { params?: { ticketId?: number } }) {
    const { ticketId } = params ?? {};
    const ticket = await api.get(`/api/support-tickets/${ticketId}`);
    const formatDate = (d: string) => new Date(d).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' });

    return (
        <div className={styles.container}>
            <Link href="/dashboard/support" className={styles.backButton}><ArrowLeft size={16} />Back to Tickets</Link>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.subject}>#{ticket.id}: {ticket.subject}</h1>
                    <p className={styles.meta}>Opened on {formatDate(ticket.created_at)}</p>
                </div>
                <span className={`${styles.statusBadge} ${styles[ticket.status.toLowerCase()]}`}>{ticket.status}</span>
            </div>
            <div className={styles.body}>
                <h2 className={styles.sectionTitle}>Your Message</h2>
                <p className={styles.description}>{ticket.description}</p>
            </div>
            {ticket.status === 'OPEN' && (
                <form action={deleteTicketAction.bind(null, ticket.id)} className={styles.deleteForm}>
                    <button type="submit" className={styles.deleteButton}><Trash2 size={14} /> Delete Ticket</button>
                </form>
            )}
        </div>
    );
}