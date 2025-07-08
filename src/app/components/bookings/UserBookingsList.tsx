'use client';

import { useTransition } from 'react';
import { Calendar, Clock, XCircle } from 'lucide-react';
import { cancelBookingAction } from '@/actions/bookingActions';
import styles from './UserBookingsList.module.css';

export default function UserBookingsList({ bookings }: { bookings: any[] }) {
    const [isPending, startTransition] = useTransition();

    const handleCancel = (bookingId: string) => {
        if (confirm("Are you sure you want to cancel this booking? Credits will be refunded according to the cancellation policy.")) {
            startTransition(async () => {
                const result = await cancelBookingAction(bookingId);
                if (!result.success) {
                    alert(`Error: ${result.message}`);
                } else {
                    alert(result.message);
                }
            });
        }
    };
 
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    const formatTime = (dateString: string) => new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    return (
        <div className={styles.listContainer}>
            {bookings.map(booking => {
                const isCancellable = booking.status === 'CONFIRMED' && new Date(booking.start_time) > new Date();
                
                return (
                    <div key={booking.id} className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.roomName}>{booking.room_name}</h3>
                            {/* <span className={`${styles.statusBadge} ${styles[booking.status.toLowerCase()]}`}>
                                {booking.status}
                            </span> */}
                        </div>
                        <div className={styles.details}>
                            <div className={styles.detailItem}><Calendar size={14} /> <span>{formatDate(booking.start_time)}</span></div>
                            <div className={styles.detailItem}><Clock size={14} /> <span>{formatTime(booking.start_time)} to {formatTime(booking.end_time)}</span></div>
                        </div>
                        <div className={styles.actions}>
                            {isCancellable && (
                                <button 
                                    onClick={() => handleCancel(booking.id)} 
                                    className={styles.cancelButton}
                                    disabled={isPending}
                                >
                                    <XCircle size={16}/>
                                    <span>Cancel Booking</span>
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}