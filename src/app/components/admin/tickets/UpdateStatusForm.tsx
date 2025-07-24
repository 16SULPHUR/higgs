'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api.client';
import styles from './UpdateStatusForm.module.css';

export default function UpdateStatusForm({ ticket, onUpdate }: { ticket: any, onUpdate: () => void }) {
    const [status, setStatus] = useState(ticket.status);
    const [response, setResponse] = useState(ticket.response || '');
    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
        setStatus(ticket.status);
        setResponse(ticket.response || '');
    }, [ticket]);

    const handleUpdate = async () => {
        setIsPending(true);
        try {
            const payload = { status, response: response.trim() === '' ? undefined : response.trim() };
            await api.patch(`/api/admin/support-tickets/${ticket.id}/status`, payload);
            alert('Ticket updated successfully.');
            onUpdate();
        } catch (err: any) {
            alert(`Error: ${err.message}`);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className={styles.card}>
            <h3 className={styles.title}>Manage Ticket</h3>
            <div className={styles.formGroup}><label htmlFor="status">Set Status</label><select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className={styles.select} disabled={isPending}>{['OPEN', 'IN_PROGRESS', 'CLOSED'].map(s => <option key={s} value={s}>{s}</option>)}</select></div>
            <div className={styles.formGroup}><label htmlFor="response">Admin Response</label><textarea id="response" value={response} onChange={(e) => setResponse(e.target.value)} rows={7} className={styles.textarea} placeholder="Provide a response or internal notes..." disabled={isPending} /></div>
            <button onClick={handleUpdate} disabled={isPending} className={styles.button}>{isPending ? 'Updating...' : 'Update Ticket'}</button>
        </div>
    );
}