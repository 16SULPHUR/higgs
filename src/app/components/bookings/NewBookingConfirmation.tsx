'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api.client';
import { Clock, Calendar, Users, Wallet, CheckCircle, MapPin } from 'lucide-react';
import styles from './BookingConfirmationForm.module.css';
import { displayDate, displayTime } from '@/lib/displayDateAndTime';
import SceneComponent from './scene';

export default function NewBookingConfirmation({ roomType, liveUserData, startDateTime, endDateTime, session }: { roomType: any, liveUserData: any, startDateTime: Date, endDateTime: Date, session: any }) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    <div className={styles.shell}>
      <section className={styles.viewerPanel}>
        <div className={styles.viewerHeader}>
          <span className={styles.badge}><MapPin size={14} /> {roomType.location_name}</span>
          <h2 className={styles.roomTitle}>{roomType.name}</h2>
          <div className={styles.metaChips}>
            <span className={styles.chip}><Users size={14} /> {roomType.capacity}</span>
            <span className={styles.chip}><Wallet size={14} /> {roomType.credits_per_booking} / 15m</span>
          </div>
        </div>
        <div className={styles.viewerCanvas}>
          <SceneComponent roomUrl={`/3d_models/${roomType.id}.glb`} />
        </div>
      </section>

      <aside className={styles.summaryPanel}>
        <div className={styles.step}>Step 2 of 2</div>
        <h3 className={styles.summaryTitle}>Review & Confirm</h3>

        <div className={styles.detailsList}>
          <div className={styles.detailRow}><Calendar size={16} /><span>{displayDate(startDateTime.toString())}</span></div>
          <div className={styles.detailRow}><Clock size={16} /><span>{displayTime(startDateTime.toString())} - {displayTime(endDateTime.toString())} ({durationInMinutes} mins)</span></div>
          <div className={styles.detailRow}><Users size={16} /><span>Up to {roomType.capacity} people</span></div>
          <div className={styles.detailRow}><MapPin size={16} /><span>{roomType.location_name}</span></div>
        </div>

        <div className={styles.totals}>
          <div>
            <p className={styles.costLabel}>Total Cost</p>
            <p className={styles.costValue}>{totalCost} Credits</p>
          </div>
          <div className={styles.balance}>
            <p className={styles.costLabel}>Your Balance</p>
            <p className={styles.costValue}>{userCredits ?? 'N/A'}</p>
          </div>
        </div>

        {error && <p className={styles.error}>{error}</p>}
        {!hasEnoughCredits && !error && (
          <p className={styles.error}>You do not have enough credits for this booking.</p>
        )}

        <button onClick={handleSubmit} disabled={isPending || !hasEnoughCredits} className={styles.confirmButton}>
          {isPending ? 'Confirming...' : <><CheckCircle size={18} /> Confirm & Spend {totalCost} Credits</>}
        </button>

        <div className={styles.secondaryActions}>
          <a href="/dashboard/find-room" className={styles.secondaryLink}>Change time</a>
        </div>
      </aside>
    </div>
  );
}