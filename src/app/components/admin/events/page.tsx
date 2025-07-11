import Link from 'next/link';
import { api } from '@/lib/apiClient';
import styles from '../rooms/RoomsPage.module.css';
import { Plus } from 'lucide-react';
import EventList from '@/components/events/EventList';

export default async function EventsPage() {
  const events = await api.get('/api/admin/events', ['events']);

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Community Events</h1>
          <p className={styles.description}>Create and manage events for your members.</p>
        </div>
        <Link href="/admin/dashboard/events/new" className={styles.addButton}>
          <Plus size={16} />
          <span>Create Event</span>
        </Link>
      </div>
      <div className={styles.tableContainer}>
        <EventList  events={events}/>
      </div>
    </div>
  );
}