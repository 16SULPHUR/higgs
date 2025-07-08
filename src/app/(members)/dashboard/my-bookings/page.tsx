import { api } from '@/lib/apiClient';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import UserBookingsList from '@/components/bookings/UserBookingsList';
import styles from './MyBookingsPage.module.css';

export default async function MyBookingsPage() { 
    const bookings = await api.get('/api/bookings', ['bookings']);

    console.log(bookings)

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>My Bookings</h1>
                <p className={styles.description}>View your past and upcoming meeting room reservations.</p>
            </div>
 
            {bookings && bookings.length > 0 ? (
                <UserBookingsList bookings={bookings} />
            ) : (
                <div className={styles.emptyState}>
                    <h2>You have no bookings yet.</h2>
                    <p>Ready to find your next workspace?</p>
                    <Link href="/dashboard/find-room" className={styles.ctaButton}>
                        <PlusCircle size={18} />
                        Book a Room
                    </Link>
                </div>
            )}
        </div>
    );
}