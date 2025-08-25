'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { api } from '@/lib/api.client';
import { Calendar, Clock, DoorOpen, Hash, Pencil, UserPlus, XCircle, Loader2, Users } from 'lucide-react';
import styles from './UserBookingsList.module.css';
import InviteGuestModal from './InviteGuestModal';

interface BookingCardProps {
    booking: any;
    onUpdate: () => void;
    session: any;
    isOngoing?: boolean;
}

export default function BookingCard({ booking, onUpdate, session, isOngoing = false }: BookingCardProps) {
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

    // Inline guest summary helpers
    const PREVIEW_COUNT = 2;
    const totalGuests = Number.isFinite(booking.guests_count) ? booking.guests_count : guests.length;
    const previewGuests = guests.slice(0, PREVIEW_COUNT);
    const overflowCount = Math.max(0, totalGuests - PREVIEW_COUNT);

    const getInitials = (nameOrEmail: string) => {
        const s = (nameOrEmail || '').trim();
        if (!s) return '?';
        const parts = s.split(/\s+/);
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
        return (parts[0][0] + parts[1][0]).toUpperCase();
    };

    return (
        <>
            <div className={`${styles.card} ${isOngoing ? styles.ongoing : ''}`}>
                      <span className={`${styles.statusBadge} ${styles[booking.status?.toLowerCase() || 'unknown']}`}>{booking.status || 'UNKNOWN'}</span>
                      {isOngoing && <span className={styles.liveBadgeTop}>Live</span>}
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
                        <div className={styles.detailItem}>
                            <Clock size={14} />
                            <span>{formatTime(booking.start_time)} to {formatTime(booking.end_time)}</span>
                        </div>
                    </div>
                    
                </div>
                <div className={styles.details}>  
                    {/* Inline guest summary */}
                    <div className={styles.guestSummaryRow}>
                        <div className={styles.guestSummaryLeft}>
                            <Users size={14} />
                            <span className={styles.guestSummaryLabel}>Guests</span>
                        </div>
                        {totalGuests > 0 ? (
                            <div
                                className={styles.guestAvatarGroup}
                                role="button"
                                tabIndex={0}
                                title="View all guests"
                                onClick={async () => { await loadGuests(); setShowGuests(true); }}
                                onKeyDown={async (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); await loadGuests(); setShowGuests(true); } }}
                            >
                                {previewGuests.map((g, idx) => (
                                    <div key={g.id || idx} className={styles.avatar} title={g.guest_name || g.guest_email}>
                                        <span className={styles.avatarText}>{getInitials(g.guest_name || g.guest_email || '')}</span>
                                    </div>
                                ))}
                                {overflowCount > 0 && (
                                    <div className={`${styles.avatar} ${styles.overflowAvatar}`}>+{overflowCount}</div>
                                )}
                                <span className={styles.countChip}>{totalGuests} invited</span>
                            </div>
                        ) : (
                            <span className={styles.noGuests}>No guests</span>
                        )}
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