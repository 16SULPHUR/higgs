'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api.client';
import styles from '../../rooms/RoomForm.module.css';

export default function CreateTicketForUserForm({ users }: { users: any[] }) {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({ user_id: '', subject: '', description: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsPending(true);
        try {
            const result = await api.post('/api/admin/support-tickets', formData);
            alert(result.message || 'Ticket created successfully.');
            router.push('/admin/dashboard/tickets');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGrid}>
                <div className={`${styles.inputGroup} ${styles.fullWidth}`}><label htmlFor="user_id">User</label><select id="user_id" name="user_id" value={formData.user_id} onChange={handleChange} required className={styles.input} disabled={isPending}><option value="" disabled>Select the user...</option>{users.map(user => (<option key={user.id} value={user.id}>{user.name} ({user.email})</option>))}</select></div>
                <div className={`${styles.inputGroup} ${styles.fullWidth}`}><label htmlFor="subject">Subject</label><input id="subject" name="subject" type="text" value={formData.subject} onChange={handleChange} required className={styles.input} disabled={isPending} /></div>
                <div className={`${styles.inputGroup} ${styles.fullWidth}`}><label htmlFor="description">Description of Issue</label><textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows={8} className={styles.input} disabled={isPending}></textarea></div>
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.formActions}>
                <button type="button" onClick={() => router.back()} className={`${styles.button} ${styles.secondary}`} disabled={isPending}>Cancel</button>
                <button type="submit" className={styles.button} disabled={isPending}>{isPending ? 'Creating Ticket...' : 'Create Ticket'}</button>
            </div>
        </form>
    );
}