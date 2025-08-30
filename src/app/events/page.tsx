'use client';

import { useState, useEffect } from 'react';
import EventList from '@/events/EventList';
import styles from './EventsPage.module.css';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  image_url?: string;
  registration_count: number;
}

export default function UserEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); // This should be determined by user role

  // Fetch events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/public/events`);
        if (res.ok) {
          const data = await res.json();
          setEvents(data);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEditEvent = (event: Event) => {
    // Navigate to edit page or open edit modal
    console.log('Edit event:', event);
    // You can implement navigation or modal opening here
  };

  const handleDeleteEvent = async (event: Event) => {
    if (confirm(`Are you sure you want to delete "${event.title}"?`)) {
      try {
        // Implement delete API call here
        console.log('Delete event:', event);
        // After successful deletion, remove from local state
        setEvents(prev => prev.filter(e => e.id !== event.id));
      } catch (error) {
        console.error('Failed to delete event:', error);
        alert('Failed to delete event. Please try again.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <p>Loading events...</p>
        </div>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Community Events</h1>
          <p className={styles.description}>
            No upcoming events at the moment. Check back later for exciting community activities!
          </p>
        </header>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Community Events</h1>
        <p className={styles.description}>
          Discover upcoming events and manage your registrations.
        </p>
      </header>

      <EventList 
        events={events} 
        isAdmin={isAdmin}
        onEditEvent={handleEditEvent}
        onDeleteEvent={handleDeleteEvent}
      />
    </div>
  );
}