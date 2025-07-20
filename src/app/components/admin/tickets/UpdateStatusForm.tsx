'use client';

import { useState, useTransition } from 'react';
import { updateTicketStatusAction } from '@/actions/adminTicketActions';
import styles from './UpdateStatusForm.module.css';

const statuses = ['OPEN', 'IN_PROGRESS', 'CLOSED'];

export default function UpdateStatusForm({ ticket }: { ticket: any }) {
    const [status, setStatus] = useState(ticket.status);
    const [isPending, startTransition] = useTransition();

    const handleUpdate = () => {
        startTransition(async () => {
            const result = await updateTicketStatusAction(ticket.id, status);
            if (result.success) {
                alert(result.message);
            } else {
                alert(`Error: ${result.message}`);
            }
        });
    };
    
    return (
        <div className={styles.card}>
            <h3 className={styles.title}>Ticket Status</h3>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className={styles.select} disabled={isPending}>
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button onClick={handleUpdate} disabled={isPending || status === ticket.status} className={styles.button}>
                {isPending ? 'Updating...' : 'Update Status'}
            </button>
        </div>
    );
}