'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Trash2, Loader2 } from 'lucide-react';
import { api } from '@/lib/api.client';
import styles from './TicketDetailPage.module.css';
import { useSessionContext } from '@/contexts/SessionContext';

export default function TicketDetailPage() {
  const router = useRouter();
  const params = useParams();
  const session = useSessionContext();

  const ticketId = params.ticketId as string | undefined;

  const [ticket, setTicket] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!session || !ticketId) { 
      setTicket(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    const fetchTicket = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await api.get(session, `/api/support-tickets/${ticketId}`);
        setTicket(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load ticket details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTicket();
  }, [session, ticketId]);

  const handleDelete = async () => {
    if (!session || !ticket) return;

    if (confirm("Are you sure you want to delete this ticket? This action cannot be undone.")) {
      setIsDeleting(true);
      try {
        await api.delete(session, `/api/support-tickets/${ticket.id}`);
        alert('Ticket deleted successfully.');
        router.push('/dashboard/support');
      } catch (err: any) {
        setError(err.message || 'Failed to delete ticket.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Loader2 className={styles.loaderIcon} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className={styles.container}>
        <p>Ticket not found.</p>
      </div>
    );
  }

  const formatDate = (d: string) => 
    new Date(d).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' });

  return (
    <div className={styles.container}>
      <a href="/dashboard/support" className={styles.backButton}>
        <ArrowLeft size={16} />
        Back to Tickets
      </a>
      <div className={styles.header}>
        <div>
          <h1 className={styles.subject}>
            #{ticket.id}: {ticket.subject}
          </h1>
          <p className={styles.meta}>Opened on {formatDate(ticket.created_at)}</p>
        </div>
        <span className={`${styles.statusBadge} ${styles[ticket.status.toLowerCase()]}`}>
          {ticket.status}
        </span>
      </div>
      <div className={styles.body}>
        <h2 className={styles.sectionTitle}>Your Message</h2>
        <p className={styles.description}>{ticket.description}</p>
        {ticket.response && (
          <>
            <h2 className={`${styles.sectionTitle} ${styles.responseTitle}`}>
              Admin's Response
            </h2>
            <div className={styles.responseBlock}>
              <p>{ticket.response}</p>
            </div>
          </>
        )}
      </div>
      {ticket.status === 'OPEN' && (
        <div className={styles.deleteForm}>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={styles.deleteButton}
          >
            <Trash2 size={14} />
            {isDeleting ? 'Deleting...' : 'Delete Ticket'}
          </button>
        </div>
      )}
    </div>
  );
}
