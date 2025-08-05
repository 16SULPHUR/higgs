'use client';

import { useState, useMemo } from 'react';
import styles from './UserBookingsList.module.css';
import BookingCard from './BookingCard';
import { useSessionContext } from '@/contexts/SessionContext';

interface UserBookingsListProps {
  bookings: any[];
  onUpdate: () => void;
}

type FilterType = 'UPCOMING' | 'PAST';

export default function UserBookingsList({ bookings, onUpdate }: UserBookingsListProps) {
    const session = useSessionContext();
    const [activeFilter, setActiveFilter] = useState<FilterType>('UPCOMING');

    const filteredBookings = useMemo(() => {
        const now = new Date();
        if (activeFilter === 'UPCOMING') {
            return bookings.filter(b => b.status === 'CONFIRMED' && new Date(b.start_time) > now);
        } else {
            return bookings.filter(b => b.status === 'CANCELLED' || (b.status === 'CONFIRMED' && new Date(b.end_time) <= now));
        }
    }, [bookings, activeFilter]);

    return (
        <div>
            <div className={styles.filterBar}>
                <button onClick={() => setActiveFilter('UPCOMING')} className={`${styles.filterButton} ${activeFilter === 'UPCOMING' ? styles.activeFilter : ''}`}>Upcoming</button>
                <button onClick={() => setActiveFilter('PAST')} className={`${styles.filterButton} ${activeFilter === 'PAST' ? styles.activeFilter : ''}`}>Past & Cancelled</button>
            </div>
            <div className={styles.listContainer}>
                {filteredBookings.length > 0 ? (
                    filteredBookings.map(booking => (
                        <BookingCard session={session} key={booking.id} booking={booking} onUpdate={onUpdate} />
                    ))
                ) : (
                    <div className={styles.emptyFilterState}><p>No {activeFilter.toLowerCase()} bookings found.</p></div>
                )}
            </div>
        </div>
    );
}