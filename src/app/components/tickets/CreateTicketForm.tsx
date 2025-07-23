'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { api } from '@/lib/api.client';
import styles from './CreateTicketForm.module.css';

export default function CreateTicketForm() {
    const router = useRouter();
    const { status } = useSession();
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsPending(true);

        try {
            await api.post('/api/support-tickets', { subject, description });
            alert('Ticket submitted successfully!');
            router.push('/dashboard/support');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
                <label htmlFor="subject">Subject</label>
                <input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} required disabled={isPending || status !== 'authenticated'} className={styles.input} />
            </div>
            <div className={styles.inputGroup}>
                <label htmlFor="description">How can we help?</label>
                <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={8} disabled={isPending || status !== 'authenticated'} className={styles.input}></textarea>
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.actions}>
                <button type="submit" disabled={isPending || status !== 'authenticated'} className={styles.button}>
                    {isPending ? 'Submitting...' : 'Submit Ticket'}
                </button>
            </div>
        </form>
    );
}