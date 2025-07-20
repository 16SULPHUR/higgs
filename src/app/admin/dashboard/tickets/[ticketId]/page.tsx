import { api } from '@/lib/apiClient';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import UpdateStatusForm from '@/components/admin/tickets/UpdateStatusForm';
import styles from './AdminTicketDetailPage.module.css';
import { displayDate, displayTime } from '@/lib/displayDateAndTime';

export default async function AdminTicketDetailPage({ params }: { params?: { ticketId?: number } }) {
    const { ticketId } = params ?? {};
    const ticket = await api.get(`/api/admin/support-tickets/${ticketId}`, [`admin-ticket-${ticketId}`]);

    return (
        <div>
            <Link href="/admin/dashboard/tickets" className={styles.backButton}><ArrowLeft size={16} />Back to All Tickets</Link>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.subject}>Ticket #{ticket.id}: {ticket.subject}</h1>
                    <p className={styles.meta}>From: {ticket.user_name} ({ticket.user_email}) on {displayDate(ticket.created_at)} at {displayTime(ticket.created_at)}</p>
                </div>
            </div>
            <div className={styles.grid}>
                <div className={styles.ticketBody}>
                    <h2 className={styles.sectionTitle}>User's Message</h2>
                    <p className={styles.description}>{ticket.description}</p>
                </div>
                <aside className={styles.sidebar}>
                    <UpdateStatusForm ticket={ticket} />
                </aside>
            </div>
        </div>
    );
}