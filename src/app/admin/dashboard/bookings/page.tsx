'use client';

import styles from '../rooms/RoomsPage.module.css';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { api } from '@/lib/api.client';
import BookingsTable from '@/components/admin/bookings/BookingsTable';
import TableSkeleton from '@/components/common/TableSkeleton';

export default function AdminBookingsPage() {
    const { status } = useSession();
    const [bookings, setBookings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBookings = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await api.get('/api/admin/bookings');
            setBookings(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (status === 'authenticated') {
            fetchBookings();
        }
    }, [status]);

    const renderContent = () => {
        if (isLoading || status === 'loading') {
            return <div className={styles.tableContainer}><TableSkeleton cols={5}/></div>;
        }
        if (error) {
            return <p>Error: {error}</p>;
        }
        return (
            <div className={styles.tableContainer}>
                <BookingsTable bookings={bookings} onUpdate={fetchBookings} />
            </div>
        );
    };

    return (
        <div>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>All Bookings</h1>
                    <p className={styles.description}>View and manage all bookings across the platform.</p>
                </div>
            </div>
            {renderContent()}
        </div>
    );
}