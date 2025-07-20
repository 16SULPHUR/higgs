'use client';

import { useState, useTransition } from 'react'; 
import styles from './CreateTicketForm.module.css';
import { createTicketAction } from '@/actions/usersTicketActions';

export default function CreateTicketForm() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        startTransition(async () => {
            const result = await createTicketAction({ subject, description });
            if (result?.success === false) {
                setError(result.message);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}><label htmlFor="subject">Subject</label><input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} required disabled={isPending} className={styles.input} /></div>
            <div className={styles.inputGroup}><label htmlFor="description">How can we help?</label><textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={8} disabled={isPending} className={styles.input}></textarea></div>
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.actions}><button type="submit" disabled={isPending} className={styles.button}>{isPending ? 'Submitting...' : 'Submit Ticket'}</button></div>
        </form>
    );
}