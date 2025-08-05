'use client';

import { useState } from 'react';
import { api } from '@/lib/api.client';
import styles from './InviteGuestForm.module.css';
import { Send } from 'lucide-react';

interface InviteGuestFormProps {
  bookingId: string;
  onInviteSuccess: () => void;
  session: any;
}

export default function InviteGuestForm({ bookingId, onInviteSuccess, session }: InviteGuestFormProps) {
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

    if (!session) {
      setError('You must be logged in to invite guests.');
      setIsPending(false);
      return;
    }

    const payload = {
      guestName: name,
      guestEmail: email,
    };

    try {
      const result = await api.post(session, `/api/bookings/${bookingId}/invite`, payload);
      setSuccess(result.message);
      setName('');
      setEmail('');
      onInviteSuccess();  
    } catch (err: any) {
      setError(err.message || 'Failed to send invite.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputGroup}>
        <label htmlFor="guestName">Guest Name</label>
        <input
          id="guestName"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isPending || !session}
          className={styles.input}
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="guestEmail">Guest Email</label>
        <input
          id="guestEmail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isPending || !session}
          className={styles.input}
        />
      </div>
      
      {error && (
        <p className={styles.messageText} style={{ color: 'hsl(var(--destructive))' }}>
          {error}
        </p>
      )}
      {success && (
        <p className={styles.messageText} style={{ color: 'hsl(var(--primary))' }}>
          {success}
        </p>
      )}

      <button
        type="submit"
        className={styles.button}
        disabled={isPending || !session}
      >
        <Send size={16} />
        <span>{isPending ? 'Sending...' : 'Send Invite'}</span>
      </button>
    </form>
  );
}
