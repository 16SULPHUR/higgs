import EventCard from './EventCard';
import styles from './EventList.module.css';

interface EventListProps {
  events: any[];
  isAdmin?: boolean;
  onEditEvent?: (event: any) => void;
  onDeleteEvent?: (event: any) => void;
}

export default function EventList({ events, isAdmin = false, onEditEvent, onDeleteEvent }: EventListProps) {
    const handleEdit = (event: any) => {
        if (onEditEvent) {
            onEditEvent(event);
        }
    };

    const handleDelete = (event: any) => {
        if (onDeleteEvent) {
            onDeleteEvent(event);
        }
    };

    return (
        <div>
            {events.length > 0 ? (
                <div className={styles.grid}>
                    {events.map(event => (
                        <EventCard 
                            key={event.id} 
                            event={event} 
                            isAdmin={isAdmin}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
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