import { api } from '@/lib/apiClient';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import RoomTypeSearchForm from '@/components/search/RoomTypeSearchForm';
import styles from './ReschedulePage.module.css';
import CurrentBookingDetails from '@/components/bookings/CurrentBookingDetails';

export default async function ReschedulePage({ params }: { params: { bookingId: string } }) {
    const { bookingId } = params;

    const originalBooking = await api.get(`/api/bookings/${bookingId}`);

    return (
        <div className={styles.container}>
            <Link href="/dashboard/my-bookings" className={styles.backButton}>
                <ArrowLeft size={16} />
                <span>Back to My Bookings</span>
            </Link>

            <div className={styles.grid}> 
                <aside className={styles.currentBookingSection}>
                    <h1 className={styles.title}>Current Booking</h1>
                    <p className={styles.description}>You are rescheduling this booking. Your credits will be adjusted based on your new selection.</p>
                    <CurrentBookingDetails booking={originalBooking} />
                </aside>
 
                <main className={styles.searchSection}>
                     <h1 className={styles.title}>Find a New Slot</h1>
                     <p className={styles.description}>Search for a new room type or time below.</p>
                    <RoomTypeSearchForm rescheduleBookingId={bookingId} />
                </main>
            </div>
        </div>
    );
}