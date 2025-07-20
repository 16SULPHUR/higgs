import { api } from '@/lib/apiClient';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import AdminTicketsTable from '@/components/admin/tickets/AdminTicketsTable';
import styles from './AdminTicketsPage.module.css';

export default async function AdminTicketsPage() {
  const tickets = await api.get('/api/admin/support-tickets', ['admin-tickets']);
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
            <h1 className={styles.title}>Support Tickets</h1>
            <p className={styles.description}>View, manage, and respond to all user support tickets.</p>
        </div>
        <Link href="/admin/dashboard/tickets/new" className={styles.newTicketButton}>
            <PlusCircle size={18} />
            <span>Create Ticket for User</span>
        </Link>
      </div>
      <div className={styles.tableContainer}>
        <AdminTicketsTable tickets={tickets} />
      </div>
    </div>
  );
}