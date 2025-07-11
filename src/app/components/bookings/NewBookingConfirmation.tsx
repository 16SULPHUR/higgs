'use client';

import { useState, useTransition } from 'react';
import { createBookingAction } from '@/actions/bookingActions';
import { Clock, Calendar, Users, Wallet, CheckCircle, MapPin } from 'lucide-react';
import styles from './BookingConfirmationForm.module.css';
import { displayDate, displayTime } from '@/lib/displayDateAndTime';

export default function NewBookingConfirmation({ roomType, liveUserData, startDateTime, endDateTime }: { roomType: any, liveUserData: any, startDateTime: Date, endDateTime: Date }) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = () => {
        setError(null);
        startTransition(async () => {
            const payload = {
                type_of_room_id: roomType.id,
                start_time: formatDateInKolkata(startDateTime),
                end_time: formatDateInKolkata(endDateTime),
            };

            console.log("payload", payload);

            const result = await createBookingAction(payload);
            if (result?.success === false) {
                setError(result.message);
            }
        });
    };


    // function getLocalOffset(date: Date): string {
    //     const offset = -date.getTimezoneOffset(); 
    //     const sign = offset >= 0 ? "+" : "-";
    //     const absOffset = Math.abs(offset);
    //     const hours = String(Math.floor(absOffset / 60)).padStart(2, '0');
    //     const minutes = String(absOffset % 60).padStart(2, '0');
    //     return `${sign}${hours}:${minutes}`;
    // }

    function formatDateInKolkata(date: Date): string {
        const formatter = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hourCycle: 'h23',
        });

        const parts = formatter.formatToParts(date);
        const get = (type: string) => parts.find(p => p.type === type)?.value;

        const year = get('year');
        const month = get('month');
        const day = get('day');
        const hour = get('hour');
        const minute = get('minute');
        const second = get('second');

        // Hardcode the +05:30 offset because Asia/Kolkata is always UTC+05:30
        return `${year}-${month}-${day}T${hour}:${minute}:${second}+05:30`;
    }

    function formatDateTimeInKolkata(date: Date, options: Intl.DateTimeFormatOptions): string {
        return new Intl.DateTimeFormat('en-IN', {
            timeZone: 'Asia/Kolkata',
            ...options
        }).format(date);
    }



    const durationInMinutes = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60);
    const totalCost = (durationInMinutes / 30) * roomType.credits_per_booking;
    const userCredits = liveUserData.role === 'INDIVIDUAL_USER'
        ? liveUserData.individual_credits
        : liveUserData.organization_credits_pool;

    const hasEnoughCredits = userCredits >= totalCost;

    const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true };

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.roomName}>{roomType.name}</h2>

            <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                    <Calendar size={16} />
                    <span>{displayDate(startDateTime.toString())}</span>
                </div>

                <div className={styles.detailItem}>
                    <Clock size={16} />
                    <span>
                        {displayTime(startDateTime.toString())} - {displayTime(endDateTime.toString())} ({durationInMinutes} mins)
                    </span>
                </div>
                <div className={styles.detailItem}>
                    <Users size={16} /><span>For up to {roomType.capacity} people</span></div>
                <div className={styles.detailItem}><MapPin size={16} /><span>{roomType.location_name}</span></div>
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
                    <><CheckCircle size={18} /> Confirm & Spend {totalCost} Credits</>
                )}
            </button>
        </div>
    );
}