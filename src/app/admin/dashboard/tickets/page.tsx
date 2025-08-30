'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api.client';
import { PlusCircle, Loader2 } from 'lucide-react';
import AdminTicketsTable from '@/components/admin/tickets/AdminTicketsTable';
import TableSkeleton from '@/components/common/TableSkeleton';
import styles from './AdminTicketsPage.module.css';
import { useSession } from '@/contexts/SessionContext';

export default function AdminTicketsPage() {
  const session = useSession();
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!session) {
      // No session - clear tickets and stop loading
      setTickets([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get(session, '/api/admin/support-tickets');
      setTickets(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load support tickets.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchData();
    } else {
      // If session disappears, reset state accordingly
      setTickets([]);
      setIsLoading(false);
      setError(null);
    }
  }, [session]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Support Tickets</h1>
          <p className={styles.description}>
            View, manage, and respond to all user support tickets.
          </p>
        </div>
        <a href="/admin/dashboard/tickets/new" className={styles.newTicketButton}>
          <PlusCircle size={18} />
          <span>Create Ticket for User</span>
        </a>
      </div>
      <div className={styles.tableContainer}>
        {isLoading ? (
          <TableSkeleton cols={4} />
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <AdminTicketsTable tickets={tickets} onUpdate={fetchData} />
        )}
      </div>
    </div>
  );
}
