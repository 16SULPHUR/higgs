'use client';

import { useState, useTransition } from 'react';
import { rescheduleBookingAction } from '@/actions/bookingActions';
import { Clock, Calendar, Users, Wallet, MapPin, Repeat } from 'lucide-react';
import styles from './BookingConfirmationForm.module.css';

export default function RescheduleConfirmation({ newRoomType, liveUserData, startDateTime, endDateTime, originalBooking }: { newRoomType: any, liveUserData: any, startDateTime: Date, endDateTime: Date, originalBooking: any }) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = () => {
        setError(null);
        startTransition(async () => {
            const payload = {
                new_type_of_room_id: newRoomType.id,
                new_start_time: startDateTime.toISOString(),
                new_end_time: endDateTime.toISOString()
            };
            const result = await rescheduleBookingAction(originalBooking.id, payload);
            
            if (result?.success === false) {
                setError(result.message);
            }
        });
    };
 
    const newDurationInMinutes = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60);
    const newCost = (newDurationInMinutes / 30) * newRoomType.credits_per_booking;
    
    const originalDurationInMinutes = (new Date(originalBooking.end_time).getTime() - new Date(originalBooking.start_time).getTime()) / (1000 * 60);
    const oldCost = (originalDurationInMinutes / 30) * originalBooking.credits_per_booking;

    const creditDifference = oldCost - newCost;

    const userCredits = liveUserData.role === 'INDIVIDUAL_USER' 
        ? liveUserData.individual_credits 
        : liveUserData.organization_credits_pool;
    
    const finalCreditsAfter = userCredits + creditDifference;
    const hasEnoughCredits = finalCreditsAfter >= 0;

    const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true };

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.roomName}>{newRoomType.name}</h2>
            <p className={styles.rescheduleSubtext}>Rescheduling from: {originalBooking.room_type_name}</p>
            
            <div className={styles.detailGrid}>
                <div className={styles.detailItem}><Calendar size={16} /><span>{startDateTime.toLocaleDateString(undefined, dateOptions)}</span></div>
                <div className={styles.detailItem}><Clock size={16} /><span>{startDateTime.toLocaleTimeString(undefined, timeOptions)} - {endDateTime.toLocaleTimeString(undefined, timeOptions)} ({newDurationInMinutes} mins)</span></div>
                <div className={styles.detailItem}><Users size={16} /><span>For up to {newRoomType.capacity} people</span></div>
                <div className={styles.detailItem}><MapPin size={16} /><span>{newRoomType.location_name}</span></div>
            </div>

            <div className={styles.costSection}>
                <div>
                    <p className={styles.costLabel}>Credit Adjustment</p>
                    <p className={styles.costValue} style={{color: creditDifference >= 0 ? '#22c55e' : '#ef4444'}}>
                        {creditDifference >= 0 ? `+${creditDifference}` : creditDifference}
                        <span className={styles.costLabel}> {creditDifference >= 0 ? '(Refund)' : '(Additional Cost)'}</span>
                    </p>
                </div>
                <div className={styles.balance}>
                    <p className={styles.costLabel}>Your Current Balance</p>
                    <p className={styles.costValue}>{userCredits ?? 'N/A'}</p>
                </div>
            </div>
            
            {error && <p className={styles.error}>{error}</p>}
            
            {!hasEnoughCredits && !error &&
                <p className={styles.error}>You do not have enough credits for this change.</p>
            }

            <button onClick={handleSubmit} disabled={isPending || !hasEnoughCredits} className={styles.confirmButton}>
                {isPending ? 'Confirming...' : <><Repeat size={18} /> Confirm Reschedule</>}
            </button>
        </div>
    );
}