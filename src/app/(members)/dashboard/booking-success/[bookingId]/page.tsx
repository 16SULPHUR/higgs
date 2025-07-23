'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { CheckCircle, Loader2 } from 'lucide-react';
import { api } from '@/lib/api.client';
import InviteGuestForm from '@/components/bookings/InviteGuestForm';
import styles from './BookingSuccessPage.module.css';
import { displayDate, displayTime } from '@/lib/displayDateAndTime';

export default function BookingSuccessPage() {
    const params = useParams();
    const { status } = useSession();
    const [booking, setBooking] = useState<any>(null);
    const [invitedGuests, setInvitedGuests] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const bookingId = params.bookingId as string;

    const fetchAllData = async () => {
        if (!bookingId) return;
        try {
            const [bookingData, guestsData] = await Promise.all([
                api.get(`/api/bookings/${bookingId}`),
                api.get(`/api/bookings/${bookingId}/invitations`)
            ]);
            setBooking(bookingData);
            setInvitedGuests(guestsData);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (status === 'authenticated') {
            fetchAllData();
        }
    }, [status, bookingId]);

    if (isLoading || status === 'loading') {
        return <div className={styles.container}><Loader2 className={styles.loaderIcon} /></div>;
    }
    if (error) {
        return <div className={styles.container}><p>{error}</p></div>;
    }
    if (!booking) {
        return <div className={styles.container}><p>Booking details not found.</p></div>;
    }

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
                        <p><strong>Date:</strong> {displayDate(booking.start_time)}</p>
                        <p><strong>Time:</strong> {displayTime(booking.start_time)} - {displayTime(booking.end_time)}</p>
                    </div>
                    <a href="/dashboard/my-bookings" className={styles.ctaButton}>View All My Bookings</a>
                </div>

                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>Manage Guests</h2>
                    <InviteGuestForm bookingId={bookingId} onInviteSuccess={fetchAllData} />
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