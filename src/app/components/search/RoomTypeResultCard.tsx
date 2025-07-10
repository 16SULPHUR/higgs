import { Users, MapPin, DollarSign } from 'lucide-react';
import styles from './RoomResultCard.module.css';
import Link from 'next/link';

export default function RoomTypeResultCard({ roomType, searchCriteria }: { roomType: any, searchCriteria: any }) {

  const isReschedule = !!searchCriteria.rescheduleBookingId;

  const params = new URLSearchParams();
  params.set('newTypeOfRoomId', roomType.id);
  params.set('start', searchCriteria.startDateTimeISO);
  params.set('end', searchCriteria.endDateTimeISO);

  let confirmationUrl = '/dashboard/book';
  if (isReschedule) {
    params.set('originalBookingId', searchCriteria.rescheduleBookingId);
    confirmationUrl = `/dashboard/reschedule/confirm`;
  }

  const finalUrl = `${confirmationUrl}?${params.toString()}`;


  return (
    <div className={styles.card}>
      <h3 className={styles.roomName}>{roomType.name}</h3>
      <p className={styles.roomType}>{roomType.location_name}</p>
      <div className={styles.details}>
        <span className={styles.detailItem}><Users size={14} /> Up to {roomType.capacity} people</span>
        <span className={styles.detailItem}><DollarSign size={14} /> {roomType.credits_per_booking} credits per 30 min</span>
      </div>
      <Link href={finalUrl} className={styles.bookButton}>
        {isReschedule ? 'Select New Slot' : 'Book This Space'}
      </Link>
    </div>
  );
}