'use client';

import EventCard from './EventCard';
import styles from './EventList.module.css';

export default function EventList({ initialEvents }: { initialEvents: any[] }) {
    return (
        <div>
            {initialEvents.length > 0 ? (
                <div className={styles.grid}>
                    {initialEvents.map(event => <EventCard key={event.id} event={event} />)}
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