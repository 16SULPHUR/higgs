import { api } from '@/lib/apiClient';
import Link from 'next/link';
import { CheckCircle, Users } from 'lucide-react';
import InviteGuestForm from '@/components/bookings/InviteGuestForm';
import styles from './BookingSuccessPage.module.css';

export default async function BookingSuccessPage({ params }: { params: { bookingId: string } }) {
    const { bookingId } = params;
    
    const [booking, invitedGuests] = await Promise.all([
        api.get(`/api/bookings/${bookingId}`),
        api.get(`/api/bookings/${bookingId}/invitations`, ['invitations'])
    ]);

    const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { dateStyle: 'full' });
    const formatTime = (d: string) => new Date(d).toLocaleTimeString('en-US', { timeStyle: 'short' });

    return (
        <div className={styles.container}>
            <div className={styles.successHeader}>
                <CheckCircle size={48} className={styles.successIcon} />
                <h1 className={styles.title}>Booking Confirmed!</h1>
                <p className={styles.description}>Your booking is complete. You can now invite guests or view your bookings.</p>
            </div>

            <div className={styles.grid}>
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>Your Booking Details</h2>
                    <div className={styles.detailList}>
                        <p><strong>Room:</strong> {booking.room_type_name} ({booking.room_instance_name})</p>
                        <p><strong>Date:</strong> {formatDate(booking.start_time)}</p>
                        <p><strong>Time:</strong> {formatTime(booking.start_time)} - {formatTime(booking.end_time)}</p>
                    </div>
                    <Link href="/dashboard/my-bookings" className={styles.ctaButton}>View All My Bookings</Link>
                </div>

                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>Manage Guests</h2>
                    <InviteGuestForm bookingId={bookingId} />
                    <hr className={styles.divider} />
                    <div className={styles.guestList}>
                        <h3 className={styles.guestListTitle}>Invited Guests ({invitedGuests.length})</h3>
                        {invitedGuests.length > 0 ? (
                            <ul>{invitedGuests.map((guest: any) => <li key={guest.id}>{guest.guest_name} ({guest.guest_email})</li>)}</ul>
                        ) : (
                            <p className={styles.noGuestsText}>No guests have been invited yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}