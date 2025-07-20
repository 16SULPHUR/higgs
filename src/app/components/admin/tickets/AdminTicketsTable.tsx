'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import styles from './AdminTicketsTable.module.css';

export default function AdminTicketsTable({ tickets }: { tickets: any[] }) {
    const [filter, setFilter] = useState('OPEN');
    const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const filteredTickets = useMemo(() => {
        if (filter === 'ALL') return tickets;
        return tickets.filter(t => t.status === filter);
    }, [tickets, filter]);

    return (
        <div>
            <div className={styles.filterBar}>
                <button onClick={() => setFilter('OPEN')} className={filter === 'OPEN' ? styles.activeFilter : ''}>Open</button>
                <button onClick={() => setFilter('IN_PROGRESS')} className={filter === 'IN_PROGRESS' ? styles.activeFilter : ''}>In Progress</button>
                <button onClick={() => setFilter('CLOSED')} className={filter === 'CLOSED' ? styles.activeFilter : ''}>Closed</button>
                <button onClick={() => setFilter('ALL')} className={filter === 'ALL' ? styles.activeFilter : ''}>All Tickets</button>
            </div>
            <table className={styles.table}>
                <thead><tr><th>User</th><th>Subject</th><th>Status</th><th>Last Updated</th></tr></thead>
                <tbody>
                    {filteredTickets.map(ticket => (

                        <tr key={ticket.id}>
                            <td>
                                <div>{ticket.user_name}</div>
                                <div className={styles.subtext}>{ticket.user_email}</div>
                            </td>
                            <td><Link href={`/admin/dashboard/tickets/${ticket.id}`} className={styles.subjectLink}>#{ticket.id}: {ticket.subject}</Link></td>
                            <td><span className={`${styles.statusBadge} ${styles[ticket.status.toLowerCase()]}`}>{ticket.status}</span></td>
                            <td>{formatDate(ticket.updated_at)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {filteredTickets.length === 0 && <p className={styles.emptyText}>No tickets match the current filter.</p>}
        </div>
    );
}