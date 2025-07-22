import { api } from '@/lib/apiClient';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import UpdateStatusForm from '@/components/admin/tickets/UpdateStatusForm';
import styles from './AdminTicketDetailPage.module.css';

export default async function AdminTicketDetailPage({ params }: { params: { ticketId: number } }) {
    const ticket = await api.get(`/api/admin/support-tickets/${params.ticketId}`, [`admin-ticket-${params.ticketId}`]);
    const formatDate = (d: string) => new Date(d).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' });

    return (
        <div>
            <Link href="/admin/dashboard/tickets" className={styles.backButton}><ArrowLeft size={16} />Back to All Tickets</Link>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.subject}>Ticket #{ticket.id}: {ticket.subject}</h1>
                    <p className={styles.meta}>From: {ticket.user_name} ({ticket.user_email}) on {formatDate(ticket.created_at)}</p>
                </div>
            </div>
            <div className={styles.grid}>
                <div className={styles.ticketBody}>
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>User's Message</h2>
                        <p className={styles.description}>{ticket.description}</p>
                    </div>

                    {ticket.response && (
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Admin's Response</h2>
                            <div className={styles.responseBlock}>
                                <p>{ticket.response}</p>
                            </div>
                        </div>
                    )}
                </div>
                <aside className={styles.sidebar}>
                    <UpdateStatusForm ticket={ticket} />
                </aside>
            </div>
        </div>
    );
}