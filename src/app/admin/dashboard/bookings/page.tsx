'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api.client';
import BookingsTable from '@/components/admin/bookings/BookingsTable';
import TableSkeleton from '@/components/common/TableSkeleton';
import { useSession } from '@/contexts/SessionContext';
import styles from './BookingsPage.module.css';

export default function AdminBookingsPage() {
  const session = useSession();
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    if (!session) {
      setBookings([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get(session, '/api/admin/bookings');
      setBookings(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load bookings.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchBookings();
    } else {
      // If session disappears, reset state accordingly
      setBookings([]);
      setIsLoading(false);
      setError(null);
    }
  }, [session]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={styles.tableContainer}>
          <TableSkeleton cols={5} />
        </div>
      );
    }
    if (error) {
      return <p>Error: {error}</p>;
    }
    return (
      <div className={styles.tableContainer}>
        <BookingsTable session={session} bookings={bookings} onUpdate={fetchBookings} />
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>All Bookings</h1>
          <p className={styles.description}>
            View and manage all bookings across the platform.
          </p>
        </div>
      </div>
      {renderContent()}
    </div>
  );
}
