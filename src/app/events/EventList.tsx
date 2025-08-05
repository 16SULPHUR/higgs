import EventCard from './EventCard';
import styles from './EventList.module.css';

interface EventListProps {
  events: any[];
}

export default function EventList({ events }: EventListProps) { 
    return (
        <div>
            {events.length > 0 ? (
                <div className={styles.grid}>
                    {events.map(event => <EventCard key={event.id} event={event} />)}
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