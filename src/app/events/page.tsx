import EventList from '@/events/EventList';
import styles from './EventsPage.module.css';  

async function getEvents() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/public/events`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json();
}
 
export default async function UserEventsPage() {
  const events = await getEvents() ?? null;
    if (!events) { return <div>Events not found.</div>; }

  return (
    <div className={styles.container}> 
      <header className={styles.header}>
        <h1 className={styles.title}>Community Events</h1>
        <p className={styles.description}>
          Discover upcoming events and manage your registrations.
        </p>
      </header>

      <EventList events={events} />
    </div>
  );
}
