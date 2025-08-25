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
            // Show both future and ongoing (end_time in future)
            return bookings.filter(b => b.status === 'CONFIRMED' && new Date(b.end_time) > now);
        } else {
            // Past & cancelled
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
                    filteredBookings.map(booking => {
                        const now = new Date();
                        const start = new Date(booking.start_time);
                        const end = new Date(booking.end_time);
                        const isOngoing = start <= now && now < end && booking.status === 'CONFIRMED';
                        return (
                            <BookingCard
                                session={session}
                                key={booking.id}
                                booking={booking}
                                onUpdate={onUpdate}
                                isOngoing={isOngoing}
                            />
                        );
                    })
                ) : (
                    <div className={styles.emptyFilterState}><p>No {activeFilter.toLowerCase()} bookings found.</p></div>
                )}
            </div>
        </div>
    );
}