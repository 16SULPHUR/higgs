import Link from 'next/link';
import styles from './TicketList.module.css';

export default function TicketList({ tickets }: { tickets: any[] }) {
    const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className={styles.listContainer}>
            <div className={styles.listHeader}>
                <div className={styles.subject}>Subject</div>
                <div className={styles.status}>Status</div>
                <div className={styles.lastUpdated}>Last Updated</div>
            </div>
            {tickets.length > 0 ? (
                tickets.map(ticket => (
                    <a href={`/dashboard/support/${ticket.id}`} key={ticket.id} className={styles.ticketItem}>
                        <div className={styles.subject}>
                            <span className={styles.ticketId}>#{ticket.id}</span> {ticket.subject}
                        </div>
                        <div
                            className={styles.status}>
                            <span className={`${styles.statusBadge} ${styles[ticket.status.toLowerCase()]}`}>
                                {ticket.status}
                            </span>
                        </div>
                        <div className={styles.lastUpdated}>{formatDate(ticket.updated_at)}</div>
                    </a>
                ))
            ) : (
                <div className={styles.emptyState}>
                    <p>You haven't created any support tickets yet.</p>
                </div>
            )}
        </div>
    );
}