'use client';

import { useState, useTransition } from 'react';
import { Calendar, Clock, DoorOpen, Hash, Pencil, UserPlus, XCircle } from 'lucide-react';
import { cancelBookingAction } from '@/actions/bookingActions';
import styles from './UserBookingsList.module.css';
import InviteGuestModal from './InviteGuestModal';
import Link from 'next/link';

export default function BookingCard({ booking }: { booking: any }) {
    const [isPending, startTransition] = useTransition();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const isModifiable = booking.status === 'CONFIRMED' && new Date(booking.start_time) > new Date();


    const handleCancel = (bookingId: string) => {
        if (confirm("Are you sure you want to cancel this booking? Credits will be refunded according to the cancellation policy.")) {
            startTransition(async () => {
                const result = await cancelBookingAction(bookingId);
                if (result?.success === false) {
                    alert(`Error: ${result.message}`);
                } else {
                    alert(result?.message || 'Booking cancelled successfully.');
                }
            });
        }
    };

    const formatDate = (utcDateString: string) => new Date(utcDateString).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    const formatTime = (utcDateString: string) => new Date(utcDateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    const isCancellable = booking.status === 'CONFIRMED' && new Date(booking.start_time) > new Date();

    const rescheduleUrl = `/dashboard/reschedule/${booking.id}`;


    return (
        <>
            <div className={styles.card}>
                {/* {isModifiable && (
                    <div className={styles.actions}>
                        <Link href={`/dashboard/find-room?rescheduleBookingId=${booking.id}`} className={styles.modifyButton}>
                            <Pencil size={16} /><span>Modify</span>
                        </Link>

                        <button onClick={() => setIsModalOpen(true)} className={styles.inviteButton} disabled={isPending}>
                            <UserPlus size={16} /><span>Invite Guest</span>
                        </button>

                        <button onClick={() => handleCancel(booking.id)} className={styles.cancelButton} disabled={isPending}>
                            <XCircle size={16} /><span>Cancel</span>
                        </button>
                    </div>
                )} */}
                <div className={styles.cardHeader}>
                    <h3 className={styles.roomName}>{booking.room_type_name}</h3>
                    <span className={`${styles.statusBadge} ${styles[booking.status?.toLowerCase() || 'unknown']}`}>{booking.status || 'UNKNOWN'}</span>
                </div>
                <div className={styles.details}>
                    <div className={styles.detailItem}>
                        <DoorOpen size={14} />
                        <span><strong>Instance:</strong> {booking.room_instance_name}</span>
                    </div>
                    <div className={styles.detailItem}>
                        <Calendar size={14} />
                        <span>{formatDate(booking.start_time)}</span>
                    </div>
                    <div className={styles.detailItem}>
                        <Clock size={14} />
                        <span>{formatTime(booking.start_time)} to {formatTime(booking.end_time)}</span>
                    </div>
                    <div className={styles.detailItem}>
                        <Hash size={14} />
                        <span className={styles.bookingId}>ID: {booking.id}</span>
                    </div>
                </div>

                {isModifiable && (
                    <div className={styles.actions}>
                        <Link href={rescheduleUrl} className={styles.modifyButton}>
                            <Pencil size={16} /><span>Modify</span>
                        </Link>

                        {/* <button onClick={() => setIsModalOpen(true)} className={styles.inviteButton} disabled={isPending}>
                            <UserPlus size={16} /><span>Invite Guest</span>
                        </button>

                        <button onClick={() => handleCancel(booking.id)} className={styles.cancelButton} disabled={isPending}>
                            <XCircle size={16} /><span>Cancel</span>
                        </button> */}
                    </div>
                )}

                {isCancellable && (
                    <div className={styles.actions}>
                        <button onClick={() => setIsModalOpen(true)} className={styles.inviteButton} disabled={isPending}>
                            <UserPlus size={16} />
                            <span>Invite Guest</span>
                        </button>
                        <button onClick={() => handleCancel(booking.id)} className={styles.cancelButton} disabled={isPending}>
                            <XCircle size={16} />
                            <span>{isPending ? 'Cancelling...' : 'Cancel'}</span>
                        </button>
                    </div>
                )}
            </div>

            <InviteGuestModal
                bookingId={booking.id}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}