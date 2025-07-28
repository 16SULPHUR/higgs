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
    console.log("session:", session);
 
    if (session === undefined) { 
      return;
    }

    if (session === null || !session?.accessToken) { 
      router.push('/login');
      return;
    } 

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
          api.get(session, `/api/room-types/${typeOfRoomId}`),
          api.get(session, '/api/auth/me'),
        ]);
        console.log('Fetched data:', newRoomTypeData, userData);
        setData({ newRoomType: newRoomTypeData, liveUserData: userData });
      } catch (err: any) {
        console.error('Failed to fetch booking data:', err);
         
        try {
          let errorMessage = 'Could not load booking details.';
          
          if (err.message) {
            try {
              const errorBody = JSON.parse(err.message);
              errorMessage = errorBody.message || errorMessage;
            } catch (parseError) {
              errorMessage = err.message;
            }
          }
          
          setError(errorMessage);
        } catch (parseError) {
          setError('Could not load booking details.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [session, typeOfRoomId, date, startTime, endTime, router]);
 
  if (session === undefined) {
    return (
      <div className={styles.container}>
        <div className={styles.stateContainer}>
          <Loader2 className={styles.loaderIcon} />
          <p>Loading session...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={styles.stateContainer}>
          <Loader2 className={styles.loaderIcon} />
          <p>Loading booking details...</p>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className={styles.stateContainer}>
          <p className={styles.errorText}>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className={styles.retryButton}
          >
            Try Again
          </button>
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
        <p>Something went wrong. Please try again.</p>
        <button 
          onClick={() => router.push('/dashboard/find-room')} 
          className={styles.retryButton}
        >
          Back to Search
        </button>
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
