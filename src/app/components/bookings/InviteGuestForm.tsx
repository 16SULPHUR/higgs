'use client';

import { useState, useTransition } from 'react';
import { sendGuestInviteAction } from '@/actions/inviteActions';
import styles from './InviteGuestForm.module.css';
import { Send } from 'lucide-react';

export default function InviteGuestForm({ bookingId }: { bookingId: string }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        startTransition(async () => {
            const result = await sendGuestInviteAction(bookingId, name, email);
            if (result.success) {
                setSuccess(result.message);
                setName('');
                setEmail('');
            } else {
                setError(result.message);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
                <label htmlFor="guestName">Guest Name</label>
                <input id="guestName" type="text" value={name} onChange={(e) => setName(e.target.value)} required disabled={isPending} className={styles.input} />
            </div>
            <div className={styles.inputGroup}>
                <label htmlFor="guestEmail">Guest Email</label>
                <input id="guestEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isPending} className={styles.input} />
            </div>
            
            {error && <p className={styles.messageText} style={{color: 'hsl(var(--destructive))'}}>{error}</p>}
            {success && <p className={styles.messageText} style={{color: 'hsl(var(--primary))'}}>{success}</p>}

            <button type="submit" className={styles.button} disabled={isPending}>
                <Send size={16} />
                <span>{isPending ? 'Sending...' : 'Send Invite'}</span>
            </button>
        </form>
    );
}