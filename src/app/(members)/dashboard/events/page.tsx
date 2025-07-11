import { api } from '@/lib/apiClient';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import EventList from '@/components/events/user/EventList';
import styles from './EventsPage.module.css';

export default async function UserEventsPage() {
  const events = await api.get('/api/events', ['user-events']);

  return (
    <div className={styles.container}>
      <Link href="/dashboard" className={styles.backButton}>
        <ArrowLeft size={16} />
        <span>Back to Dashboard</span>
      </Link>
      <div className={styles.header}>
        <h1 className={styles.title}>Community Events</h1>
        <p className={styles.description}>
          Discover upcoming events and manage your registrations.
        </p>
      </div>
      <EventList initialEvents={events} />
    </div>
  );
}