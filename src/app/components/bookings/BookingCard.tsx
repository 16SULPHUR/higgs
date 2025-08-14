'use client';

import { useState } from 'react';
import Image from 'next/image';
import { api } from '@/lib/api.client';
import { Calendar, Clock, DoorOpen, Hash, Pencil, UserPlus, XCircle, Loader2, Users } from 'lucide-react';
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
    const [guests, setGuests] = useState<Array<{ id?: string; guest_name: string; guest_email?: string }>>(
        Array.isArray(booking.guests_preview) ? booking.guests_preview.map((name: string) => ({ guest_name: name })) : []
    );
    const [showGuests, setShowGuests] = useState(false);

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

    // Fetch guests when modal to view is opened the first time
    const loadGuests = async () => {
        if (!session) return;
        try {
            const result = await api.get(session, `/api/bookings/${booking.id}/invitations`);
            if (Array.isArray(result)) setGuests(result);
        } catch (err) {
            // noop
        }
    };

    return (
        <>
            <div className={styles.card}>
                      <span className={`${styles.statusBadge} ${styles[booking.status?.toLowerCase() || 'unknown']}`}>{booking.status || 'UNKNOWN'}</span>
                <div className={styles.mediaRow}>
                    <div className={styles.imageWrapLarge}>
                        {booking.room_icon ? (
                            <Image src={booking.room_icon} alt={booking.room_type_name} fill className={styles.roomImage} />
                        ) : null}
                    </div>
                    <div className={styles.headerContent}>
                        <h3 className={styles.roomName}>{booking.room_type_name}</h3>
                        <div className={styles.detailItem}><DoorOpen size={14} /><span> {booking.room_instance_name}</span></div>
                        <div className={styles.detailItem}><Calendar size={14} /><span>{formatDate(booking.start_time)}</span></div>
                    <div className={styles.detailItem}><Clock size={14} /><span>{formatTime(booking.start_time)} to {formatTime(booking.end_time)}</span></div>
                    </div>
                    
                </div>
                <div className={styles.details}>  
                     
                    <div className={styles.detailItem}>
                        <Users size={14} />
                         <span><strong>Guests:</strong> {Array.isArray(guests) && guests.length > 0 ? (
                          <>
                            {guests.slice(0, 3).map((g, idx) => (
                              <span key={g.id || idx} className={styles.guestChip}>{g.guest_name || g.guest_email}</span>
                            ))}
                             {Number.isFinite(booking.guests_count) && booking.guests_count > 2 && (
                               <button className={styles.moreGuestsBtn} onClick={async () => { await loadGuests(); setShowGuests(true); }}>+{booking.guests_count - 2}</button>
                             )}
                          </>
                        ) : (
                          <span className={styles.noGuests}>No guests</span>
                        )}</span>
                    </div>
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
            {showGuests && (
              <div className={styles.modalOverlay} onClick={() => setShowGuests(false)}>
                <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                  <div className={styles.modalHeader}><h3>Invited Guests</h3></div>
                  <div className={styles.modalBody}>
                    {guests.length === 0 ? (
                      <p className={styles.muted}>No guests invited.</p>
                    ) : (
                      <ul className={styles.guestList}>
                        {guests.map((g) => (
                          <li key={g.id} className={styles.guestListItem}>
                            <span className={styles.guestName}>{g.guest_name || 'Guest'}</span>
                            <span className={styles.guestEmail}>{g.guest_email}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className={styles.modalActions}>
                    <button className={styles.closeBtn} onClick={() => setShowGuests(false)}>Close</button>
                  </div>
                </div>
              </div>
            )}
        </>
    );
}