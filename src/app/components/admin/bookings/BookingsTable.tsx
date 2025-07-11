'use client';

import { useTransition } from 'react';
import { XCircle } from 'lucide-react';
import { cancelBookingByAdmin } from '@/actions/adminBookingActions';
import styles from './BookingsTable.module.css';

export default function BookingsTable({ bookings }: { bookings: any[] }) {
    const [isPending, startTransition] = useTransition();

    const handleCancel = (bookingId: string) => {
        if (confirm("Are you sure you want to cancel this booking? This will refund the user's credits.")) {
            startTransition(async () => {
                const result = await cancelBookingByAdmin(bookingId);
                if (!result.success) {
                    alert(`Error: ${result.message}`);
                } else {
                    alert(result.message);
                }
            });
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
                                    disabled={isPending}
                                    title="Cancel Booking"
                                >
                                    <XCircle size={16} />
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}