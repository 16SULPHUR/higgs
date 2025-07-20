'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createTicketForUserAction } from '@/actions/adminTicketActions';
import styles from '../../rooms/RoomForm.module.css'; // Reusing the master form styles

export default function CreateTicketForUserForm({ users }: { users: any[] }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        user_id: '',
        subject: '',
        description: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        startTransition(async () => {
            const result = await createTicketForUserAction(formData);
            if (result.success) {
                alert(result.message || 'Ticket created successfully.');
                router.push('/admin/dashboard/tickets');
            } else {
                setError(result.message);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGrid}>
                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                    <label htmlFor="user_id">User</label>
                    <select
                        id="user_id"
                        name="user_id"
                        value={formData.user_id}
                        onChange={handleChange}
                        required
                        className={styles.input}
                        disabled={isPending}
                    >
                        <option value="" disabled>Select the user this ticket is for...</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                        ))}
                    </select>
                </div>
                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                    <label htmlFor="subject">Subject</label>
                    <input
                        id="subject"
                        name="subject"
                        type="text"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className={styles.input}
                        disabled={isPending}
                    />
                </div>
                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                    <label htmlFor="description">Description of Issue</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={8}
                        className={styles.input}
                        disabled={isPending}
                    ></textarea>
                </div>
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.formActions}>
                <button type="button" onClick={() => router.back()} className={`${styles.button} ${styles.secondary}`} disabled={isPending}>
                    Cancel
                </button>
                <button type="submit" className={styles.button} disabled={isPending}>
                    {isPending ? 'Creating Ticket...' : 'Create Ticket'}
                </button>
            </div>
        </form>
    );
}