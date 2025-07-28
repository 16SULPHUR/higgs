'use client';

import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api.client';
import { Calendar, Clock, DoorOpen, Hash, Pencil, UserPlus, XCircle, Loader2 } from 'lucide-react';
import styles from './UserBookingsList.module.css';
import InviteGuestModal from './InviteGuestModal';

interface BookingCardProps {
    booking: any;
    onUpdate: () => void;
    session: any;
}

export default function BookingCard({ booking, onUpdate, session }: BookingCardProps) {
    const [isPending, setIsPending] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCancel = async () => {
        if (confirm("Are you sure you want to cancel this booking?")) {
            setIsPending(true);
            try {
                const result = await api.delete(session, `/api/bookings/${booking.id}`);
                alert(result.message || 'Booking cancelled successfully.');
                onUpdate();
            } catch (error: any) {
                alert(`Error: ${error.message}`);
            } finally {
                setIsPending(false);
            }
        }
    };

    const formatDate = (utcDateString: string) => new Date(utcDateString).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    const formatTime = (utcDateString: string) => new Date(utcDateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    const isModifiable = booking.status === 'CONFIRMED' && new Date(booking.start_time) > new Date();

    return (
        <>
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <h3 className={styles.roomName}>{booking.room_type_name}</h3>
                    <span className={`${styles.statusBadge} ${styles[booking.status?.toLowerCase() || 'unknown']}`}>{booking.status || 'UNKNOWN'}</span>
                </div>
                <div className={styles.details}>
                    <div className={styles.detailItem}><DoorOpen size={14} /><span><strong>Instance:</strong> {booking.room_instance_name}</span></div>
                    <div className={styles.detailItem}><Calendar size={14} /><span>{formatDate(booking.start_time)}</span></div>
                    <div className={styles.detailItem}><Clock size={14} /><span>{formatTime(booking.start_time)} to {formatTime(booking.end_time)}</span></div>
                    <div className={styles.detailItem}><Hash size={14} /><span className={styles.bookingId}>ID: {booking.id}</span></div>
                </div>

                {isModifiable && (
                    <div className={styles.actions}>
                        <a href={`/dashboard/reschedule/${booking.id}`} className={styles.modifyButton}><Pencil size={16} /><span>Modify</span></a>
                        <button onClick={() => setIsModalOpen(true)} className={styles.inviteButton} disabled={isPending}><UserPlus size={16} /><span>Invite Guest</span></button>
                        <button onClick={handleCancel} className={styles.cancelButton} disabled={isPending}>
                            {isPending ? <Loader2 size={16} className={styles.spinner} /> : <XCircle size={16} />}
                            <span>{isPending ? 'Cancelling...' : 'Cancel'}</span>
                        </button>
                    </div>
                )}
            </div>
            <InviteGuestModal bookingId={booking.id} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
}