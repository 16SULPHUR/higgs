'use client';

import { useState } from 'react';
import { api } from '@/lib/api.client';
import { XCircle, Loader2 } from 'lucide-react';
import styles from './BookingsTable.module.css';

interface BookingsTableProps {
  bookings: any[];
  onUpdate: () => void;
  session: any;
}

export default function BookingsTable({ bookings, onUpdate, session }: BookingsTableProps) {
    const [isCancelling, setIsCancelling] = useState<string | null>(null);

    const handleCancel = async (bookingId: string) => {
        if (confirm("Are you sure you want to cancel this booking? This will refund the user's credits.")) {
            setIsCancelling(bookingId);
            try {
                const result = await api.delete(session, `/api/admin/bookings/${bookingId}`);
                alert(result.message || 'Booking cancelled successfully.');
                onUpdate();
            } catch (error: any) {
                alert(`Error: ${error.message}`);
            } finally {
                setIsCancelling(null);
            }
        }
    };

    const formatDateTime = (utcDateString: string) => {
        return new Date(utcDateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th>Room / Instance</th>
                    <th>User</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {bookings.map((booking) => (
                    <tr key={booking.id}>
                        <td>
                            <div>{booking.room_type_name}</div>
                            <div className={styles.subtext}>{booking.room_instance_name}</div>
                        </td>
                        <td>
                            <div>{booking.user_name}</div>
                            <div className={styles.subtext}>{booking.user_email}</div>
                        </td>
                        <td>{formatDateTime(booking.start_time)}</td>
                        <td>
                            <span className={`${styles.statusBadge} ${styles[booking.status?.toLowerCase() || 'unknown']}`}>
                                {booking.status || 'UNKNOWN'}
                            </span>
                        </td>
                        <td className={styles.actions}>
                            {booking.status === 'CONFIRMED' && (
                                <button
                                    onClick={() => handleCancel(booking.id)}
                                    className={`${styles.iconButton} ${styles.deleteButton}`}
                                    disabled={isCancelling === booking.id}
                                    title="Cancel Booking"
                                >
                                    {isCancelling === booking.id ? <Loader2 size={16} className={styles.spinner} /> : <XCircle size={16} />}
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}