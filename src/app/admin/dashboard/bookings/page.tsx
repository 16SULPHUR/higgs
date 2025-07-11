import { api } from '@/lib/apiClient';
import BookingsTable from '@/components/admin/bookings/BookingsTable';
import styles from '../rooms/RoomsPage.module.css';

export default async function AdminBookingsPage() {
  const bookings = await api.get('/api/admin/bookings', ['admin-bookings']);

  return (
    <div>
      <div className={styles.header}>
        <div>
            <h1 className={styles.title}>All Bookings</h1>
            <p className={styles.description}>View and manage all bookings across the platform.</p>
        </div>
      </div>
      <div className={styles.tableContainer}>
        <BookingsTable bookings={bookings} />
      </div>
    </div>
  );
}