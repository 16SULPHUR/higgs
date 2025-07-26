'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, PlusCircle, Loader2 } from 'lucide-react';
import { api } from '@/lib/api.client';
import UserBookingsList from '@/components/bookings/UserBookingsList';
import styles from './MyBookingsPage.module.css';
import { useSessionContext } from '@/contexts/SessionContext';

export default function MyBookingsPage() {
  const session = useSessionContext();
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
      const data = await api.get('/api/bookings');
      setBookings(data);
    } catch (err: any) {
      setError(err.message);
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
        <div className={styles.loadingState}>
          <Loader2 className={styles.loaderIcon} />
        </div>
      );
    }
    if (error) {
      return <p>Error: {error}</p>;
    }
    if (bookings.length === 0) {
      return (
        <div className={styles.emptyState}>
          <h2>You have no bookings yet.</h2>
          <p>Ready to find your next workspace?</p>
          <a href="/dashboard/find-room" className={styles.ctaButton}>
            <PlusCircle size={18} />
            Book a Room
          </a>
        </div>
      );
    }
    return <UserBookingsList bookings={bookings} onUpdate={fetchBookings} />;
  };

  return (
    <div className={styles.container}>
      <a href="/dashboard" className={styles.backButton}>
        <ArrowLeft size={16} />
        <span>Back to Dashboard</span>
      </a>
      <div className={styles.header}>
        <h1 className={styles.title}>My Bookings</h1>
        <p className={styles.description}>
          View your past and upcoming meeting room reservations.
        </p>
      </div>
      {renderContent()}
    </div>
  );
}
