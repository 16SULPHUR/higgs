'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api.client';
import styles from './CreateTicketForm.module.css';
import { useSessionContext } from '@/contexts/SessionContext';

export default function CreateTicketForm() {
  const router = useRouter();
  const session = useSessionContext();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    if (!session) {
      setError('You must be logged in to submit a ticket.');
      setIsPending(false);
      return;
    }

    try {
      await api.post('/api/support-tickets', { subject, description });
      alert('Ticket submitted successfully!');
      router.push('/dashboard/support');
    } catch (err: any) {
      setError(err.message || 'Failed to submit ticket.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputGroup}>
        <label htmlFor="subject">Subject</label>
        <input
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          disabled={isPending || !session}
          className={styles.input}
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="description">How can we help?</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={8}
          disabled={isPending || !session}
          className={styles.input}
        />
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.actions}>
        <button
          type="submit"
          disabled={isPending || !session}
          className={styles.button}
        >
          {isPending ? 'Submitting...' : 'Submit Ticket'}
        </button>
      </div>
    </form>
  );
}
