'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { api } from '@/lib/api.client';
import styles from './EventRegistrationsPage.module.css';
import { useSessionContext } from '@/contexts/SessionContext';

export default function EventRegistrationsPage() {
  const params = useParams();
  const session = useSessionContext();

  const eventId = params.id as string | undefined;

  const [event, setEvent] = useState<any>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Fetching registrations for event:', eventId);

    if (!session || !eventId) {
      // No session or eventId - reset state and stop loading
      setEvent(null);
      setRegistrations([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [eventData, regsData] = await Promise.all([
          api.get(`/api/admin/events/${eventId}`),
          api.get(`/api/admin/events/${eventId}/registrations`)
        ]);
        setEvent(eventData);
        setRegistrations(regsData);
      } catch (err: any) {
        setError(err.message || 'Failed to load event registrations.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [session, eventId]);

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
    if (event) {
      return (
        <div className={styles.card}>
          <ul className={styles.memberList}>
            {registrations.length > 0 ? (
              registrations.map((reg: any) => (
                <li key={reg.id} className={styles.memberItem}>
                  <span>{reg.name}</span>
                  <span className={styles.memberEmail}>{reg.email}</span>
                </li>
              ))
            ) : (
              <p className={styles.noMembers}>
                There are no registrations for this event yet.
              </p>
            )}
          </ul>
        </div>
      );
    }
    return <p>Event not found.</p>;
  };

  return (
    <div>
      <a href="/admin/dashboard/events" className={styles.backButton}>
        <ArrowLeft size={16} />
        <span>Back to Events</span>
      </a>
      <h1 className={styles.title}>
        Registrations for "{event?.title || '...'}"
      </h1>
      <p className={styles.description}>
        A total of {isLoading ? '...' : registrations.length} users have registered for this event.
      </p>
      {renderContent()}
    </div>
  );
}
