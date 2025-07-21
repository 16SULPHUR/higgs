import { api } from '@/lib/apiClient'; 
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import RescheduleConfirmation from '@/components/bookings/RescheduleConfirmation';
import styles from '../../book/BookingConfirmationPage.module.css';
import { getSession } from '@/lib/session';

interface RescheduleConfirmPageProps {
  searchParams?: {
    originalBookingId?: string;
    newTypeOfRoomId?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
  };
}

export default async function RescheduleConfirmPage({ searchParams }: RescheduleConfirmPageProps) {
    const { originalBookingId, newTypeOfRoomId, date, startTime, endTime } = searchParams ?? {};

    if (!originalBookingId || !newTypeOfRoomId || !date || !startTime || !endTime) {
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

    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(`${date}T${endTime}`);

    return (
        <div className={styles.container}>
             <a href={`/dashboard/reschedule/${originalBookingId}`} className={styles.backButton}>
                <ArrowLeft size={16} />
                <span>Back to Reschedule Search</span>
            </a>
            <h1 className={styles.title}>Confirm Reschedule</h1>
            <p className={styles.description}>Review the new details and credit adjustment before confirming.</p>
            <div className={styles.card}>
                <RescheduleConfirmation 
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