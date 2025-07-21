import { api } from '@/lib/apiClient';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import NewBookingConfirmation from '@/components/bookings/NewBookingConfirmation';
import styles from './BookingConfirmationPage.module.css';
import { getSession } from '@/lib/session';

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

    const session = await getSession();
    if (!session || !session.user) {
        redirect('/login');
    }

    const [newRoomType, liveUserData] = await Promise.all([
        api.get(`/api/room-types/${typeOfRoomId}`),
        api.get('/api/auth/me')
    ]);

    function parseKolkataTimeToUTC(dateStr: string, timeStr: string): Date {
        // Combine date and time
        const [year, month, day] = dateStr.split('-').map(Number);
        const [hour, minute] = timeStr.split(':').map(Number);

        // Subtract 5 hours 30 mins to get UTC
        const utcDate = new Date(Date.UTC(year, month - 1, day, hour - 5, minute - 30));
        return utcDate;
    }


    const startDateTime = parseKolkataTimeToUTC(date, startTime);
    const endDateTime = parseKolkataTimeToUTC(date, endTime);


    return (
        <div className={styles.container}>
            <a href="/dashboard/find-room" className={styles.backButton}>
                <ArrowLeft size={16} />
                <span>Back to Search</span>
            </a>
            <h1 className={styles.title}>Confirm Your Booking</h1>
            <p className={styles.description}>Please review the details below before confirming.</p>
            <div className={styles.card}>
                <NewBookingConfirmation
                    roomType={newRoomType}
                    liveUserData={liveUserData}
                    startDateTime={startDateTime}
                    endDateTime={endDateTime}
                />
            </div>
        </div>
    );
}