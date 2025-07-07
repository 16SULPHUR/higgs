import { api } from '@/lib/apiClient';

import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import BookingConfirmationForm from '@/components/bookings/BookingConfirmationForm';
import styles from './BookingConfirmationPage.module.css';
import { getSession } from '@/lib/session';

export default async function BookingConfirmationPage({ searchParams }: { searchParams: { [key: string]: string } }) {
    const { roomId, date, startTime, endTime } = searchParams;

    if (!roomId || !date || !startTime || !endTime) {
        redirect('/dashboard/find-room');
    }

    // --- REFACTORED DATA FETCHING ---
    // Fetch all necessary data in parallel for the best performance.
    // 1. Get the session to prove the user is logged in.
    // 2. Get the room details.
    // 3. Get the user's *live* data, including their current credit balance.
    const [session, room, liveUserData] = await Promise.all([
        getSession(),
        api.get(`/api/meeting-rooms/${roomId}`), // Your existing endpoint for room details
        api.get('/api/auth/me')        // The new endpoint for live user data
    ]);

    console.log("session")
    console.log(session)

    // Middleware should handle this, but it's a good safety check.
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
            <p className={styles.description}>Please review the details below before confirming.</p>
            <div className={styles.card}>
                <BookingConfirmationForm 
                    room={room}
                    // Pass the live, up-to-date user data to the form
                    liveUserData={liveUserData} 
                    startDateTime={startDateTime}
                    endDateTime={endDateTime}
                />
            </div>
        </div>
    );
}