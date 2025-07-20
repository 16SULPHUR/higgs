import { api } from '@/lib/apiClient';
import Link from 'next/link';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import TicketList from '@/components/tickets/TicketList';
import styles from './SupportPage.module.css';

export default async function SupportPage() {
  const tickets = await api.get('/api/support-tickets', ['user-tickets']);

  return (
    <div className={styles.container}>
      <Link href="/dashboard/dashboard" className={styles.backButton}>
        <ArrowLeft size={16} />
        <span>Back to Dashboard</span>
      </Link>
      <div className={styles.header}>
        <h1 className={styles.title}>Support Center</h1>
        <p className={styles.description}>
          View your support history or open a new ticket.
        </p>
      </div>
      <div className={styles.actions}>
        <Link href="/dashboard/support/new" className={styles.newTicketButton}>
          <PlusCircle size={18} />
          Create New Ticket
        </Link>
      </div>
      <TicketList tickets={tickets} />
    </div>
  );
}