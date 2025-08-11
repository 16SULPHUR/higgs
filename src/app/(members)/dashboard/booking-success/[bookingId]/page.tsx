'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Loader2 } from 'lucide-react';
import { api } from '@/lib/api.client';
import { useSessionContext } from '@/contexts/SessionContext';
import InviteGuestManager from '@/components/bookings/InviteGuestManager';
import styles from './BookingSuccessPage.module.css';
import { displayDate, displayTime } from '@/lib/displayDateAndTime';

export default function BookingSuccessPage() {
    const params = useParams();
    const session = useSessionContext();

    const [booking, setBooking] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const bookingId = params.bookingId as string;

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
        if (session === undefined) {
            return;
        }
        if (session) {
            fetchBookingData();
        } else {
            setIsLoading(false);
        }
    }, [session, bookingId]);

    if (isLoading || session === undefined) {
        return <div className={styles.container}><Loader2 className={styles.loaderIcon} /></div>;
    }
    if (error) {
        return <div className={styles.container}><p>{error}</p></div>;
    }
    if (!booking) {
        return <div className={styles.container}><p>Booking details not found.</p></div>;
    }

    const invitedGuests = booking.invited_guests || [];

    return (
        <div className={styles.container}>
            <div className={styles.successHeader}>
                <CheckCircle size={48} className={styles.successIcon} />
                <h1 className={styles.title}>Booking Confirmed!</h1>
                <p className={styles.description}>Your booking is complete. You can now invite guests or members.</p>
            </div>
            <div className={styles.grid}>
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>Your Booking Details</h2>
                    <div className={styles.detailList}>
                        <p><strong>Room:</strong> {booking.room_type_name} ({booking.room_instance_name})</p>
                        <p><strong>Date:</strong> {displayDate(booking.start_time)}</p>
                        <p><strong>Time:</strong> {displayTime(booking.start_time)} - {displayTime(booking.end_time)}</p>
                    </div>
                    <a href="/dashboard/my-bookings" className={styles.ctaButton}>View All My Bookings</a >
                </div>
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>Manage Guests & Members</h2>
                    <InviteGuestManager bookingId={bookingId} />
                </div>
            </div>
        </div>
    );
}