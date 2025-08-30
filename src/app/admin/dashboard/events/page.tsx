'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api.client';
import { Plus, Loader2, Calendar, Clock } from 'lucide-react'; 
import styles from './EventsPage.module.css'
import EventList from '@/components/events/EventList';
import { useSession } from '@/contexts/SessionContext';

export default function EventsPage() {
  const session = useSession();
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    if (!session) {
      // No session - clear events and stop loading
      setEvents([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get(session, '/api/admin/events');
      setEvents(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load events.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchEvents();
    } else {
      // If session disappears, reset state accordingly
      setEvents([]);
      setIsLoading(false);
      setError(null);
    }
  }, [session]);

  // Partition events into upcoming and past
  const partitionEvents = () => {
    const now = new Date();
    const upcoming: any[] = [];
    const past: any[] = [];

    events.forEach(event => {
      const eventDate = new Date(event.date);
      if (eventDate >= now) {
        upcoming.push(event);
      } else {
        past.push(event);
      }
    });

    // Sort upcoming events by date (earliest first)
    upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Sort past events by date (most recent first)
    past.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return { upcoming, past };
  };

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

    const { upcoming, past } = partitionEvents();

    return (
      <div className={styles.eventsContainer}>
        {/* Upcoming Events Section */}
        <div className={styles.eventsSection}>
          <div className={styles.sectionHeader}>
            <Clock className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Upcoming Events ({upcoming.length})</h2>
          </div>
          {upcoming.length > 0 ? (
            <EventList session={session} events={upcoming} onUpdate={fetchEvents} />
          ) : (
            <div className={styles.emptyState}>
              <Calendar size={48} />
              <p>No upcoming events</p>
              <span>Create your first event to get started</span>
            </div>
          )}
        </div>

        {/* Past Events Section */}
        <div className={styles.eventsSection}>
          <div className={styles.sectionHeader}>
            <Calendar className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Past Events ({past.length})</h2>
          </div>
          {past.length > 0 ? (
            <EventList session={session} events={past} onUpdate={fetchEvents} />
          ) : (
            <div className={styles.emptyState}>
              <Calendar size={48} />
              <p>No past events</p>
              <span>Events will appear here after they've ended</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Community Events</h1>
          <p className={styles.description}>Create and manage events for your members.</p>
        </div>
        <a href="/admin/dashboard/events/new" className={styles.addButton}>
          <Plus size={16} />
          <span>Create Event</span>
        </a>
      </div>
      {renderContent()}
    </div>
  );
}
