'use client';

import { useState, useTransition } from 'react';
import { createBookingAction } from '@/actions/bookingActions';
import { Clock, Calendar, Users, Wallet, CheckCircle, MapPin } from 'lucide-react';
import styles from './BookingConfirmationForm.module.css';

export default function BookingConfirmationForm({ roomType, liveUserData, startDateTime, endDateTime }: { roomType: any, liveUserData: any, startDateTime: Date, endDateTime: Date }) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = () => {
        setError(null);
        startTransition(async () => {
            const payload = {
                type_of_room_id: roomType.id,
                start_time: startDateTime.toISOString(),
                end_time: endDateTime.toISOString()
            };
            const result = await createBookingAction(payload);
            
            if (result?.success === false) {
                setError(result.message);
            } 
        });
    };
 
    const durationInMinutes = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60);
    const totalCost = (durationInMinutes / 30) * roomType.credits_per_booking;
    const userCredits = liveUserData.role === 'INDIVIDUAL_USER' 
        ? liveUserData.individual_credits 
        : liveUserData.organization_credits_pool;
    
    const hasEnoughCredits = userCredits >= totalCost;

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.roomName}>{roomType.name}</h2>
            
            <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                    <Calendar size={16} />
                    <span>{startDateTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className={styles.detailItem}>
                    <Clock size={16} />
                    <span>{startDateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - {endDateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} ({durationInMinutes} mins)</span>
                </div>
                <div className={styles.detailItem}>
                    <Users size={16} />
                    <span>For up to {roomType.capacity} people</span>
                </div>
                <div className={styles.detailItem}>
                    <MapPin size={16} />
                    <span>{roomType.location_name}</span>
                </div>
            </div>

            <div className={styles.costSection}>
                <div>
                    <p className={styles.costLabel}>Total Cost</p>
                    <p className={styles.costValue}>{totalCost} Credits</p>
                </div>
                <div className={styles.balance}>
                    <p className={styles.costLabel}>Your Current Balance</p>
                    <p className={styles.costValue}>{userCredits ?? 'N/A'}</p>
                </div>
            </div>
            
            {error && <p className={styles.error}>{error}</p>}
            
            {!hasEnoughCredits && !error &&
                <p className={styles.error}>You do not have enough credits for this booking.</p>
            }

            <button onClick={handleSubmit} disabled={isPending || !hasEnoughCredits} className={styles.confirmButton}>
                {isPending ? 'Confirming...' : (
                    <>
                        <CheckCircle size={18} />
                        Confirm & Spend {totalCost} Credits
                    </>
                )}
            </button>
        </div>
    );
}