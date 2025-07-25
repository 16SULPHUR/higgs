'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { api } from '@/lib/api.client';
import NewBookingConfirmation from '@/components/bookings/NewBookingConfirmation';
import styles from '@/(members)/dashboard/book/BookingConfirmationPage.module.css';
import { useSessionContext } from '@/contexts/SessionContext';

export default function BookingConfirmationWrapper() {
  const session = useSessionContext();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [data, setData] = useState<{ newRoomType: any, liveUserData: any } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const typeOfRoomId = searchParams.get('typeOfRoomId');
  const date = searchParams.get('date');
  const startTime = searchParams.get('startTime');
  const endTime = searchParams.get('endTime');

  useEffect(() => {
    // Check if user is unauthenticated
    if (!session) {
      router.push('/login');
      return;
    }

    // Check required search params
    if (!typeOfRoomId || !date || !startTime || !endTime) {
      setError('Booking information is missing. Please try again.');
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [newRoomTypeData, userData] = await Promise.all([
          api(session).get(`/api/room-types/${typeOfRoomId}`),
          api(session).get('/api/auth/me'),
        ]);
        setData({ newRoomType: newRoomTypeData, liveUserData: userData });
      } catch (err: any) {
        setError(err.message || 'Could not load booking details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [session, typeOfRoomId, date, startTime, endTime, router]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={styles.stateContainer}>
          <Loader2 className={styles.loaderIcon} />
        </div>
      );
    }
    if (error) {
      return (
        <div className={styles.stateContainer}>
          <p className={styles.errorText}>{error}</p>
        </div>
      );
    }
    if (data && date && startTime && endTime) {
      function parseKolkataTimeToUTC(dateStr: string, timeStr: string): Date {
        const [year, month, day] = dateStr.split('-').map(Number);
        const [hour, minute] = timeStr.split(':').map(Number);
        return new Date(Date.UTC(year, month - 1, day, hour - 5, minute - 30));
      }
      const startDateTime = parseKolkataTimeToUTC(date, startTime);
      const endDateTime = parseKolkataTimeToUTC(date, endTime);

      return (
        <div className={styles.card}>
          <NewBookingConfirmation
          session={session}
            roomType={data.newRoomType}
            liveUserData={data.liveUserData}
            startDateTime={startDateTime}
            endDateTime={endDateTime}
          />
        </div>
      );
    }
    return (
      <div className={styles.stateContainer}>
        <p>Something went wrong.</p>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <a href="/dashboard/find-room" className={styles.backButton}>
        <ArrowLeft size={16} />
        <span>Back to Search</span>
      </a>
      <h1 className={styles.title}>Confirm Your Booking</h1>
      <p className={styles.description}>Please review the details below before confirming.</p>
      {renderContent()}
    </div>
  );
}
