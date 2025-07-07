'use client';

import { useState, useTransition } from 'react';
import { createBookingAction } from '@/actions/bookingActions';
import { Clock, Calendar, Users, Wallet, CheckCircle } from 'lucide-react';
import styles from './BookingConfirmationForm.module.css';

export default function BookingConfirmationForm({ room, liveUserData, startDateTime, endDateTime }: { room: any, liveUserData: any, startDateTime: Date, endDateTime: Date }) {

    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = () => {
        setError(null);
        startTransition(async () => {
            const payload = {
                room_id: room.id,
                start_time: startDateTime.toISOString(),
                end_time: endDateTime.toISOString()
            };
            const result = await createBookingAction(payload);
             
            if (result?.success === false) {
                console.log(error)
                setError(result.message);
            } 
        });
    };

    const durationInMinutes = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60);
    
    const userCredits = liveUserData.role === 'INDIVIDUAL_USER' 
        ? liveUserData.individual_credits 
        : liveUserData.organization_credits_pool;
    
    const hasEnoughCredits = userCredits >= room.credits_per_booking;


    return (
        <div className={styles.wrapper}>
            <h2 className={styles.roomName}>{room.name}</h2>
            
            <div className={styles.detailGrid}>
                <div className={styles.detailItem}><Calendar size={16} /><span>{startDateTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
                <div className={styles.detailItem}><Clock size={16} /><span>{startDateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - {endDateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} ({durationInMinutes} mins)</span></div>
                <div className={styles.detailItem}><Users size={16} /><span>For up to {room.capacity} people</span></div>
            </div>

             <div className={styles.costSection}>
                <div>
                    <p className={styles.costLabel}>Cost</p>
                    <p className={styles.costValue}>{room.credits_per_booking} Credits</p>
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
                        Confirm & Spend {room.credits_per_booking} Credits
                    </>
                )}
            </button>
        </div>
    );
}