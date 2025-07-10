import { api } from '@/lib/apiClient';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import BookingConfirmationForm from '@/components/bookings/BookingConfirmationForm';
import styles from '../../book/BookingConfirmationPage.module.css';
import { getSession } from '@/lib/session';

interface RescheduleConfirmPageProps {
    searchParams?: {
        originalBookingId?: string;
        newTypeOfRoomId?: string;
        start?: string;
        end?: string;
    };
}

export default async function RescheduleConfirmPage({ searchParams }: RescheduleConfirmPageProps) {
    const { originalBookingId, newTypeOfRoomId, start, end } = searchParams ?? {};

    if (!originalBookingId || !newTypeOfRoomId || !start || !end) {
        redirect('/dashboard/my-bookings');
    }

    const session = await getSession();
    if (!session || !session.user) {
        redirect('/login');
    }

    const [originalBooking, newRoomType, liveUserData] = await Promise.all([
        api.get(`/api/bookings/${originalBookingId}`),
        api.get(`/api/room-types/${newTypeOfRoomId}`),
        api.get('/api/auth/me')
    ]);

    const startDateTime = new Date(start);
    const endDateTime = new Date(end);

    return (
        <div className={styles.container}>
            <Link href={`/dashboard/reschedule/${originalBookingId}`} className={styles.backButton}>
                <ArrowLeft size={16} />
                <span>Back to Reschedule Search</span>
            </Link>
            <h1 className={styles.title}>Confirm Reschedule</h1>
            <p className={styles.description}>Review the new details and credit adjustment before confirming.</p>
            <div className={styles.card}>
                <BookingConfirmationForm
                    newRoomType={newRoomType}
                    liveUserData={liveUserData}
                    startDateTime={startDateTime}
                    endDateTime={endDateTime}
                    originalBooking={originalBooking}
                />
            </div>
        </div>
    );
}