'use client';

import { useSessionContext } from '@/contexts/SessionContext';
import EventCard from './EventCard';
import styles from './EventList.module.css';

interface EventListProps {
  events: any[];
  onUpdate: () => void;
}

export default function EventList({ events, onUpdate }: EventListProps) {
    const session = useSessionContext();
    return (
        <div>
            {events.length > 0 ? (
                <div className={styles.grid}>
                    {events.map(event => <EventCard session={session} key={event.id} event={event} onUpdate={onUpdate} />)}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <h3>No Upcoming Events</h3>
                    <p>Check back later for new and exciting events!</p>
                </div>
            )}
        </div>
    );
}