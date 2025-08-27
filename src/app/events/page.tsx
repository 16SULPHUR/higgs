import EventList from '@/events/EventList';
import styles from './EventsPage.module.css';  

async function getEvents() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/public/events`, { next: { revalidate: 120 } });
  if (!res.ok) return null;
  return res.json();
}

export default async function UserEventsPage() {
  const events = await getEvents();

  if (!events) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Community Events</h1>
          <p className={styles.description}>
            Oops! We couldn't fetch the events data. Please try again later.
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

      <EventList events={events} />
    </div>
  );
}