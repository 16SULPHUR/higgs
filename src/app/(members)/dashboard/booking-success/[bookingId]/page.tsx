'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Loader2 } from 'lucide-react';
import InviteGuestForm from '@/components/bookings/InviteGuestForm';
import styles from './BookingSuccessPage.module.css';
import { displayDate, displayTime } from '@/lib/displayDateAndTime';
import { api } from '@/lib/api.client';
import { useSessionContext } from '@/contexts/SessionContext';

export default function BookingSuccessPage() {
  const params = useParams();
  const session = useSessionContext();

  const bookingId = params.bookingId as string | undefined;

  const [booking, setBooking] = useState<any | null>(null);
  const [invitedGuests, setInvitedGuests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

   const fetchBookingData = async () => {
        if (!bookingId) return;
        setIsLoading(true);
        try {
            const data = await api.get(session, `/api/bookings/${bookingId}`);
            setBooking(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    
  useEffect(() => {
    if (session) {
      fetchBookingData();

    } else { 
      setBooking(null);
      setInvitedGuests([]);
      setIsLoading(false);
      setError(null);
    }
  }, [session, bookingId]);
 
  if (isLoading) {
    return (
      <div className={styles.container}>
        <Loader2 className={styles.loaderIcon} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p>{error}</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className={styles.container}>
        <p>Booking details not found.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.successHeader}>
        <CheckCircle size={48} className={styles.successIcon} />
        <h1 className={styles.title}>Booking Confirmed!</h1>
        <p className={styles.description}>
          Your booking is complete. You can now invite guests or view your bookings.
        </p>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Your Booking Details</h2>
          <div className={styles.detailList}>
            <p>
              <strong>Room:</strong> {booking.room_type_name} ({booking.room_instance_name})
            </p>
            <p>
              <strong>Date:</strong> {displayDate(booking.start_time)}
            </p>
            <p>
              <strong>Time:</strong> {displayTime(booking.start_time)} - {displayTime(booking.end_time)}
            </p>
          </div>

          <Link href="/dashboard/my-bookings" className={styles.ctaButton}>
            View All My Bookings
          </Link>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Manage Guests</h2>
          <InviteGuestForm session={session} bookingId={bookingId} onInviteSuccess={fetchBookingData} />
          <hr className={styles.divider} />
          <div className={styles.guestList}>
            <h3 className={styles.guestListTitle}>Invited Guests ({invitedGuests.length})</h3>
            {invitedGuests.length > 0 ? (
              <ul>
                {invitedGuests.map((guest) => (
                  <li key={guest.id}>
                    {guest.guest_name} ({guest.guest_email})
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.noGuestsText}>No guests have been invited yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
