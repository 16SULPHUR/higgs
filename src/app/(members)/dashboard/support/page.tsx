'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, PlusCircle, Loader2 } from 'lucide-react';
import { api } from '@/lib/api.client';
import TicketList from '@/components/tickets/TicketList';
import styles from './SupportPage.module.css';
import { useSessionContext } from '@/contexts/SessionContext';

export default function SupportPage() {
  const session = useSessionContext();
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      setTickets([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    const fetchTickets = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await api.get(session, '/api/support-tickets');
        setTickets(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load support tickets.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, [session]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={styles.loadingState}>
          <Loader2 className={styles.loaderIcon} />
        </div>
      );
    }
    if (error) {
      return <p>Error: {error}</p>;
    }
    return <TicketList tickets={tickets} />;
  };

  return (
    <div className={styles.container}>
      <a href="/dashboard" className={styles.backButton}>
        <ArrowLeft size={16} />
        <span>Back to Dashboard</span>
      </a>
      <div className={styles.header}>
        <h1 className={styles.title}>Support Center</h1>
        <p className={styles.description}>
          View your support history or open a new ticket.
        </p>
      </div>
      <div className={styles.actions}>
        <a href="/dashboard/support/new" className={styles.newTicketButton}>
          <PlusCircle size={18} />
          Create New Ticket
        </a>
      </div>
      {renderContent()}
    </div>
  );
}
