'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { api } from '@/lib/api.client';
import styles from './InviteGuestForm.module.css';
import { Send } from 'lucide-react';

interface InviteGuestFormProps {
  bookingId: string;
  onInviteSuccess: () => void;
}

export default function InviteGuestForm({ bookingId, onInviteSuccess }: InviteGuestFormProps) {
    const { status } = useSession();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsPending(true);

        const payload = {
            guestName: name,
            guestEmail: email,
        };

        try {
            const result = await api.post(`/api/bookings/${bookingId}/invite`, payload);
            setSuccess(result.message);
            setName('');
            setEmail('');
            onInviteSuccess(); // Tell the parent page to re-fetch the guest list
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
                <label htmlFor="guestName">Guest Name</label>
                <input id="guestName" type="text" value={name} onChange={(e) => setName(e.target.value)} required disabled={isPending || status !== 'authenticated'} className={styles.input} />
            </div>
            <div className={styles.inputGroup}>
                <label htmlFor="guestEmail">Guest Email</label>
                <input id="guestEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isPending || status !== 'authenticated'} className={styles.input} />
            </div>
            
            {error && <p className={styles.messageText} style={{color: 'hsl(var(--destructive))'}}>{error}</p>}
            {success && <p className={styles.messageText} style={{color: 'hsl(var(--primary))'}}>{success}</p>}

            <button type="submit" className={styles.button} disabled={isPending || status !== 'authenticated'}>
                <Send size={16} />
                <span>{isPending ? 'Sending...' : 'Send Invite'}</span>
            </button>
        </form>
    );
}