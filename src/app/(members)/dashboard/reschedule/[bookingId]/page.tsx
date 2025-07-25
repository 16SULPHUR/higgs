'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { api } from '@/lib/api.client';
import RoomTypeSearchForm from '@/components/search/RoomTypeSearchForm';
import CurrentBookingDetails from '@/components/bookings/CurrentBookingDetails';
import styles from './ReschedulePage.module.css';
import { useSessionContext } from '@/contexts/SessionContext';

export default function ReschedulePage() {
  const params = useParams();
  const session = useSessionContext();

  const bookingId = params.bookingId as string | undefined;

  const [originalBooking, setOriginalBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session || !bookingId) {
      // If no session or no bookingId, reset state and stop loading
      setOriginalBooking(null);
      setIsLoading(false);
      return;
    }

    const fetchBooking = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await api(session).get(`/api/bookings/${bookingId}`);
        setOriginalBooking(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load booking details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [session, bookingId]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={styles.loadingState}>
          <Loader2 className={styles.loaderIcon} /> Loading booking details...
        </div>
      );
    }

    if (error) {
      return <p>Error: {error}</p>;
    }

    if (originalBooking) {
      return (
        <div className={styles.grid}>
          <aside className={styles.currentBookingSection}>
            <h1 className={styles.title}>Current Booking</h1>
            <p className={styles.description}>
              You are rescheduling this booking. Your credits will be adjusted based on your new selection.
            </p>
            <CurrentBookingDetails booking={originalBooking} />
          </aside>
          <main className={styles.searchSection}>
            <h1 className={styles.title}>Find a New Slot</h1>
            <p className={styles.description}>Search for a new room type or time below.</p>
            <RoomTypeSearchForm rescheduleBookingId={bookingId} />
          </main>
        </div>
      );
    }

    return <p>Could not find the booking to reschedule.</p>;
  };

  return (
    <div className={styles.container}>
      <a href="/dashboard/my-bookings" className={styles.backButton}>
        <ArrowLeft size={16} />
        <span>Back to My Bookings</span>
      </a>
      {renderContent()}
    </div>
  );
}
