import { Calendar, Clock, DoorOpen, Hash } from 'lucide-react';
import styles from './CurrentBookingDetails.module.css';

export default function CurrentBookingDetails({ booking }: { booking: any }) {
    const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { dateStyle: 'full' });
    const formatTime = (d: string) => new Date(d).toLocaleTimeString('en-US', { timeStyle: 'short' });

    return (
        <div className={styles.card}>
            <h3 className={styles.roomName}>{booking.room_type_name}</h3>
            <div className={styles.details}>
                <div className={styles.detailItem}><DoorOpen size={14} /><span><strong>Instance:</strong> {booking.room_instance_name}</span></div>
                <div className={styles.detailItem}><Calendar size={14} /><span>{formatDate(booking.start_time)}</span></div>
                <div className={styles.detailItem}><Clock size={14} /><span>{formatTime(booking.start_time)} to {formatTime(booking.end_time)}</span></div>
                <div className={styles.detailItem}><Hash size={14} /><span className={styles.bookingId}>ID: {booking.id}</span></div>
            </div>
        </div>
    );
}