'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import EventList from '@/components/events/user/EventList';
import styles from './EventsPage.module.css';
import { useSessionContext } from '@/contexts/SessionContext';
import { api } from '@/lib/api.client';

export default function UserEventsPage() {
  const session = useSessionContext();

  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch events only if session is available (authenticated)
  useEffect(() => {
    if (!session) {
      // No session, stop loading and clear events
      setIsLoading(false);
      setEvents([]);
      return;
    }

    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await api(session).get('/api/events');
        setEvents(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load events.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
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
      return <div className={styles.errorState}>Error: {error}</div>;
    }
    return <EventList events={events} onUpdate={() => {
      // Refetch events on update
      setIsLoading(true);
      setError(null);
      api(session).get('/api/events')
        .then(setEvents)
        .catch(err => setError(err.message))
        .finally(() => setIsLoading(false));
    }} />;
  };

  return (
    <div className={styles.container}>
      <Link href="/dashboard" className={styles.backButton} aria-label="Back to Dashboard">
        <ArrowLeft size={16} />
        <span>Back to Dashboard</span>
      </Link>

      <header className={styles.header}>
        <h1 className={styles.title}>Community Events</h1>
        <p className={styles.description}>
          Discover upcoming events and manage your registrations.
        </p>
      </header>

      {renderContent()}
    </div>
  );
}
