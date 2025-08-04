'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api.client';
import { Clock, Calendar, Users, Wallet, CheckCircle, MapPin, Rotate3D } from 'lucide-react';
import styles from './BookingConfirmationForm.module.css';
import { displayDate, displayTime } from '@/lib/displayDateAndTime';
import Image from 'next/image';
import SceneComponent from './scene';

export default function NewBookingConfirmation({ roomType, liveUserData, startDateTime, endDateTime, session }: { roomType: any, liveUserData: any, startDateTime: Date, endDateTime: Date, session: any }) {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [overlayVisible, setOverlayVisible] = useState(true);
    const router = useRouter();

    function formatDateInKolkata(date: Date): string {
        const formatter = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Asia/Kolkata',
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hourCycle: 'h23',
        });
        const parts = formatter.formatToParts(date);
        const get = (type: string) => parts.find(p => p.type === type)?.value;
        return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}:${get('second')}+05:30`;
    }

    const handleSubmit = async () => {
        setError(null);
        setIsPending(true);


        const payload = {
            type_of_room_id: roomType.id,
            start_time: formatDateInKolkata(startDateTime),
            end_time: formatDateInKolkata(endDateTime),
        };

        try {
            const newBooking = await api.post(session, '/api/bookings', payload);

            router.push(`/dashboard/booking-success/${newBooking.id}`);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsPending(false);
        }
    };

    const durationInMinutes = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60);
    const totalCost = (durationInMinutes / 15) * roomType.credits_per_booking;
    const userCredits = liveUserData.role === 'INDIVIDUAL_USER'
        ? liveUserData.individual_credits
        : liveUserData.organization_credits_pool;
    const hasEnoughCredits = userCredits >= totalCost;

    return (
        <div className={styles.wrapper}>
            <div className={styles.flexContainer}>
                <div>
                <h2 className={styles.roomName}>{roomType.name}</h2>
                <div className={styles.detailsSection}>
                    <div className={styles.detailGrid}>
                        <div className={styles.detailItem}><Calendar size={16} /><span>{displayDate(startDateTime.toString())}</span></div>
                        <div className={styles.detailItem}>
                            <Clock size={16} />
                            <span>{displayTime(startDateTime.toString())} - {displayTime(endDateTime.toString())} ({durationInMinutes} mins)</span>
                        </div>
                        <div className={styles.detailItem}><Users size={16} /><span>For up to {roomType.capacity} people</span></div>
                        <div className={styles.detailItem}><MapPin size={16} /><span>{roomType.location_name}</span></div>
                    </div>
                </div>
                </div>

                <div
                    className={styles.imageWrapper}
                    onMouseEnter={() => setOverlayVisible(false)}
                >
                    <SceneComponent roomUrl={`/3d_models/${roomType.id}.glb`} />
                     
                </div>
            </div>

            <div className={styles.costSection}>
                <div><p className={styles.costLabel}>Total Cost</p><p className={styles.costValue}>{totalCost} Credits</p></div>
                <div className={styles.balance}><p className={styles.costLabel}>Your Current Balance</p><p className={styles.costValue}>{userCredits ?? 'N/A'}</p></div>
            </div>
            {error && <p className={styles.error}>{error}</p>}
            {!hasEnoughCredits && !error && <p className={styles.error}>You do not have enough credits for this booking.</p>}
            <button onClick={handleSubmit} disabled={isPending || !hasEnoughCredits} className={styles.confirmButton}>
                {isPending ? 'Confirming...' : <><CheckCircle size={18} /> Confirm & Spend {totalCost} Credits</>}
            </button>
        </div>
    );
}