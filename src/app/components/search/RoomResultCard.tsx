import { Users, MapPin, DollarSign, Bolt } from 'lucide-react';
import styles from './RoomResultCard.module.css';
import Link from 'next/link';

export default function RoomResultCard({ room, searchCriteria }: { room: any, searchCriteria: any }) {
 
  const bookingUrl = `/dashboard/book?roomId=${room.id}&date=${searchCriteria.date}&startTime=${searchCriteria.startTime}&endTime=${searchCriteria.endTime}`;

  const isFcfs = room.is_fcfs === true;

  return (
    <div className={styles.card}>
      <h3 className={styles.roomName}>{room.name}</h3>
      <p className={styles.roomType}>{room.type_of_room}</p>
      <div className={styles.details}>
        <span className={styles.detailItem}><MapPin size={14} /> {room.location_name}</span>
        <span className={styles.detailItem}><Users size={14} /> Up to {room.capacity} people</span>
        {!isFcfs && <span className={styles.detailItem}><DollarSign size={14} /> {room.credits_per_booking} credits</span>}
        {isFcfs && <span className={styles.detailItem}><Bolt size={14} /> FCFS</span>}
      </div>
      {!isFcfs ? (
        <a href={`${bookingUrl}`} className={styles.bookButton}>
          Book Now
        </a>
      ) : (
        <span className={styles.badge}>Walk-in (FCFS)</span>
      )}
    </div>
  );
}