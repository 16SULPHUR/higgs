'use client';

import { useState, useEffect, useTransition } from 'react';
import { updateTicketStatusAction } from '@/actions/adminTicketActions';
import styles from './UpdateStatusForm.module.css';

const statuses = ['OPEN', 'IN_PROGRESS', 'CLOSED'];

export default function UpdateStatusForm({ ticket }: { ticket: any }) {
    const [status, setStatus] = useState(ticket.status);
    const [response, setResponse] = useState(ticket.response || '');
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        setStatus(ticket.status);
        setResponse(ticket.response || '');
    }, [ticket]);

    const handleUpdate = () => {
        startTransition(async () => {
            const payload = { 
                status,
                response: response.trim() === '' ? undefined : response.trim()
            };
            const result = await updateTicketStatusAction(ticket.id, payload);
            if (result.success) {
                alert(result.message);
            } else {
                alert(`Error: ${result.message}`);
            }
        });
    };
    
    return (
        <div className={styles.card}>
            <h3 className={styles.title}>Manage Ticket</h3>
            <div className={styles.formGroup}>
                <label htmlFor="status">Set Status</label>
                <select 
                    id="status" 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)} 
                    className={styles.select} 
                    disabled={isPending}
                >
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
            
            <div className={styles.formGroup}>
                <label htmlFor="response">Admin Response</label>
                <textarea 
                    id="response" 
                    value={response} 
                    onChange={(e) => setResponse(e.target.value)} 
                    rows={7} 
                    className={styles.textarea}
                    placeholder="Provide a response or internal notes..."
                    disabled={isPending}
                />
            </div>
            
            <button onClick={handleUpdate} disabled={isPending} className={styles.button}>
                {isPending ? 'Updating...' : 'Update Ticket'}
            </button>
        </div>
    );
}