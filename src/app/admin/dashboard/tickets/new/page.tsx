import { api } from '@/lib/apiClient';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import CreateTicketForUserForm from '@/components/admin/tickets/CreateTicketForUserForm';
import styles from '../AdminTicketsPage.module.css';

export default async function NewTicketForUserPage() {
  const users = await api.get('/api/admin/users');

  return (
    <div>
      <div className={styles.header}>
        <div>
          <a href="/admin/dashboard/tickets" className={styles.backButton}>
            <ArrowLeft size={16} />
            <span>Back to All Tickets</span>
          </a>
          <h1 className={styles.title}>Create Ticket for User</h1>
          <p className={styles.description}>
            Open a new support ticket on behalf of a specific user.
          </p>
        </div>
      </div>
      <CreateTicketForUserForm users={users} />
    </div>
  );
}