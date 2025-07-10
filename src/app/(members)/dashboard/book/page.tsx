import { api } from '@/lib/apiClient'; 
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import BookingConfirmationForm from '@/components/bookings/BookingConfirmationForm';
import styles from './BookingConfirmationPage.module.css';
import { getSession } from '@/lib/session';

interface BookingPageProps {
  searchParams: {
    typeOfRoomId?: string;
    start?: string;
    end?: string;
  };
}

export default async function BookingConfirmationPage({ searchParams }: BookingPageProps) {
    const { typeOfRoomId, start, end } = searchParams;
    if (!typeOfRoomId || !start || !end) {
        redirect('/dashboard/find-room');
    }
    
    const session = await getSession();
    if (!session?.user) {
        redirect('/login');
    }
 
    const [newRoomType, liveUserData] = await Promise.all([
        api.get(`/api/room-types/${typeOfRoomId}`),
        api.get('/api/auth/me')
    ]);

    const startDateTime = new Date(start);
    const endDateTime = new Date(end);

    return (
        <div className={styles.container}>
             <Link href="/pordashboardtal/find-room" className={styles.backButton}>
                <ArrowLeft size={16} />
                <span>Back to Search</span>
            </Link>
            <h1 className={styles.title}>Confirm Your Booking</h1>
            <p className={styles.description}>Please review the details below before confirming.</p>
            <div className={styles.card}>
                <BookingConfirmationForm 
                    newRoomType={newRoomType}
                    liveUserData={liveUserData} 
                    startDateTime={startDateTime}
                    endDateTime={endDateTime} 
                />
            </div>
        </div>
    );
}