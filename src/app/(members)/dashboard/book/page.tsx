import { api } from '@/lib/apiClient';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import BookingConfirmationForm from '@/components/bookings/BookingConfirmationForm';
import styles from './BookingConfirmationPage.module.css';
import { getSession } from '@/lib/session';

export default async function BookingConfirmationPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const roomId = searchParams?.roomId;
  const date = searchParams?.date;
  const startTime = searchParams?.startTime;
  const endTime = searchParams?.endTime;

  if (!roomId || !date || !startTime || !endTime) {
    redirect('/dashboard/find-room');
  }

  const [session, room, liveUserData] = await Promise.all([
    getSession(),
    api.get(`/api/meeting-rooms/${roomId}`),
    api.get('/api/auth/me'),
  ]);

  if (!session || !session.user) {
    redirect('/login');
  }

  const startDateTime = new Date(`${date}T${startTime}:00`);
  const endDateTime = new Date(`${date}T${endTime}:00`);

  return (
    <div className={styles.container}>
      <Link href="/dashboard/find-room" className={styles.backButton}>
        <ArrowLeft size={16} />
        <span>Back to Search</span>
      </Link>
      <h1 className={styles.title}>Confirm Your Booking</h1>
      <p className={styles.description}>
        Please review the details below before confirming.
      </p>
      <div className={styles.card}>
        <BookingConfirmationForm
          room={room}
          liveUserData={liveUserData}
          startDateTime={startDateTime}
          endDateTime={endDateTime}
        />
      </div>
    </div>
  );
}
