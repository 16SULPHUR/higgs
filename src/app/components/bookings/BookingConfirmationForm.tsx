'use client';

import { useState, useTransition } from 'react';
import { Clock, Calendar, Users, Wallet, CheckCircle, MapPin, Repeat } from 'lucide-react';
import styles from './BookingConfirmationForm.module.css';
import { useSessionContext } from '@/contexts/SessionContext';
import { api } from '@/lib/api.client'; // Use your client-side API utility
import { useRouter } from 'next/navigation';

export default function BookingConfirmationForm({ 
    newRoomType, 
    liveUserData, 
    startDateTime, 
    endDateTime, 
    originalBooking 
}: { 
    newRoomType: any, 
    liveUserData: any, 
    startDateTime: Date, 
    endDateTime: Date, 
    originalBooking?: any 
}) {
    const session = useSessionContext();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const isReschedule = !!originalBooking;

    const handleSubmit = () => {
        setError(null);
        startTransition(async () => {
            try {
                let result;
                
                if (isReschedule) {
                    const payload = {
                        new_type_of_room_id: newRoomType.id,
                        new_start_time: startDateTime.toISOString(),
                        new_end_time: endDateTime.toISOString()
                    };
                    
                    // Client-side reschedule API call
                    result = await api.post(session, `/api/bookings/${originalBooking.id}/reschedule`, payload);
                    
                    // Navigate to bookings page on success
                    router.push('/dashboard/my-bookings');
                    
                } else {
                    const payload = {
                        type_of_room_id: newRoomType.id,
                        start_time: startDateTime.toISOString(),
                        end_time: endDateTime.toISOString()
                    };
                    
                    // Client-side create booking API call
                    result = await api.post(session, '/api/bookings', payload);
                    
                    // Navigate to success page on successful booking
                    if (result?.id) {
                        router.push(`/dashboard/booking-success/${result.id}`);
                    } else {
                        setError('Booking confirmation failed: Invalid response from server.');
                    }
                }
                
            } catch (error: any) {
                console.error('Booking operation failed:', error);
                
                // Handle API error responses
                try {
                    let errorMessage = 'An unknown error occurred.';
                    
                    if (error.message) {
                        try {
                            const errorBody = JSON.parse(error.message);
                            errorMessage = errorBody.message || errorMessage;
                        } catch (parseError) {
                            errorMessage = error.message;
                        }
                    }
                    
                    setError(errorMessage);
                } catch (parseError) {
                    setError('Could not connect to the booking service. Please try again later.');
                }
            }
        });
    };

    const newDurationInMinutes = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60);
    const newCost = (newDurationInMinutes / 30) * newRoomType.credits_per_booking;
    
    const originalDurationInMinutes = isReschedule 
        ? (new Date(originalBooking.end_time).getTime() - new Date(originalBooking.start_time).getTime()) / (1000 * 60)
        : 0;
        
    const oldCost = isReschedule 
        ? (originalDurationInMinutes / 30) * originalBooking.credits_per_booking 
        : 0;

    const creditDifference = oldCost - newCost;
    console.log(originalBooking, newCost);

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
            
            <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                    <Calendar size={16} />
                    <span>{startDateTime.toLocaleDateString(undefined, dateOptions)}</span>
                </div>
                <div className={styles.detailItem}>
                    <Clock size={16} />
                    <span>
                        {startDateTime.toLocaleTimeString(undefined, timeOptions)} - {endDateTime.toLocaleTimeString(undefined, timeOptions)} ({newDurationInMinutes} mins)
                    </span>
                </div>
                <div className={styles.detailItem}>
                    <Users size={16} />
                    <span>For up to {newRoomType.capacity} people</span>
                </div>
                <div className={styles.detailItem}>
                    <MapPin size={16} />
                    <span>{newRoomType.location_name}</span>
                </div>
            </div>

            <div className={styles.costSection}>
                {isReschedule ? (
                    <div>
                        <p className={styles.costLabel}>Credit Adjustment</p>
                        <p className={styles.costValue} style={{color: creditDifference >= 0 ? '#22c55e' : '#ef4444'}}>
                            {creditDifference >= 0 ? `+${creditDifference}` : creditDifference}
                            <span className={styles.costLabel}> {creditDifference >= 0 ? '(Refund)' : '(Additional Cost)'}</span>
                        </p>
                    </div>
                ) : (
                    <div>
                        <p className={styles.costLabel}>Total Cost</p>
                        <p className={styles.costValue}>{newCost} Credits</p>
                    </div>
                )}
                <div className={styles.balance}>
                    <p className={styles.costLabel}>Your Current Balance</p>
                    <p className={styles.costValue}>{userCredits ?? 'N/A'}</p>
                </div>
            </div>
            
            {error && <p className={styles.error}>{error}</p>}
            
            {!hasEnoughCredits && !error && (
                <p className={styles.error}>You do not have enough credits for this change.</p>
            )}

            <button 
                onClick={handleSubmit} 
                disabled={isPending || !hasEnoughCredits} 
                className={styles.confirmButton}
            >
                {isPending ? 'Confirming...' : (
                    isReschedule ? 
                    <><Repeat size={18} /> Confirm Reschedule</> : 
                    <><CheckCircle size={18} /> Confirm & Spend {newCost} Credits</>
                )}
            </button>
        </div>
    );
}
