import { api } from '@/lib/apiClient';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import BookingConfirmationForm from '@/components/bookings/BookingConfirmationForm';
import styles from './BookingConfirmationPage.module.css';
import { getSession } from '@/lib/session';
import { use } from 'react';

interface BookingPageProps {
  searchParams?: {
    typeOfRoomId?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
  };
}

export default async function BookingConfirmationPage({ searchParams }: BookingPageProps) {
  const { typeOfRoomId, date, startTime, endTime } = searchParams ?? {};

  if (!typeOfRoomId || !date || !startTime || !endTime) {
    redirect('/dashboard/find-room');
  }

  const [session, roomType, liveUserData] = await Promise.all([
    getSession(),
    api.get(`/api/meeting-rooms/${typeOfRoomId}`),
    api.get('/api/auth/me')
  ]);

  if (!session || !session.user) { redirect('/login'); }

  const startDateTime = new Date(`${date}T${startTime}:00`);
  const endDateTime = new Date(`${date}T${endTime}:00`);

  return (
    <div className={styles.container}>
      <Link href="/dashboard/find-room" className={styles.backButton}><ArrowLeft size={16} /><span>Back to Search</span></Link>
      <h1 className={styles.title}>Confirm Your Booking</h1>
      <p className={styles.description}>Please review the details below before confirming.</p>
      <div className={styles.card}>
        <BookingConfirmationForm
          roomType={roomType}
          liveUserData={liveUserData}
          startDateTime={startDateTime}
          endDateTime={endDateTime}
          rawStartTime={startTime}
          rawEndTime={endTime}
        />
      </div>
    </div>
  );
}