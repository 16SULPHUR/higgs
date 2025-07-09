import { Users, MapPin, DollarSign } from 'lucide-react';
import styles from './RoomResultCard.module.css';
import Link from 'next/link';

export default function RoomTypeResultCard({ roomType, searchCriteria }: { roomType: any, searchCriteria: any }) {
    
  const bookingUrl = `/dashboard/book?typeOfRoomId=${roomType.id}&date=${searchCriteria.date}&startTime=${searchCriteria.startTime}&endTime=${searchCriteria.endTime}`;

  return (
    <div className={styles.card}>
      <h3 className={styles.roomName}>{roomType.name}</h3>
      <p className={styles.roomType}>{roomType.location_name}</p>
      <div className={styles.details}>
        <span className={styles.detailItem}><Users size={14} /> Up to {roomType.capacity} people</span>
        <span className={styles.detailItem}><DollarSign size={14} /> {roomType.credits_per_booking} credits per 30 min</span>
      </div>
      <Link href={bookingUrl} className={styles.bookButton}>
        Book This Space
      </Link>
    </div>
  );
}