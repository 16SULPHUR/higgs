'use client';

import { Calendar, Clock, DoorOpen, Hash } from 'lucide-react';
import styles from './CurrentBookingDetails.module.css';

export default function CurrentBookingDetails({ booking }: { booking: any }) {
    const TIMEZONE = 'Asia/Kolkata';

    const displayDate = (isoDate: string) =>
        new Date(isoDate).toLocaleDateString('en-US', {
            dateStyle: 'full',
            timeZone: TIMEZONE,
        });

    const displayTime = (isoDate: string) =>
        new Date(isoDate).toLocaleTimeString('en-US', {
            timeStyle: 'short',
            timeZone: TIMEZONE,
        });

    return (
        <div className={styles.card}>
            <h3 className={styles.roomName}>{booking.room_type_name}</h3>
            <div className={styles.details}>
                <div className={styles.detailItem}><DoorOpen size={14} /><span><strong>Instance:</strong> {booking.room_instance_name}</span></div>
                <div className={styles.detailItem}><Calendar size={14} /><span>{displayDate(booking.start_time)}</span></div>
                <div className={styles.detailItem}><Clock size={14} /><span>{displayTime(booking.start_time)} to {displayTime(booking.end_time)}</span></div>
                <div className={styles.detailItem}><Hash size={14} /><span className={styles.bookingId}>ID: {booking.id}</span></div>
            </div>
        </div>
    );
}