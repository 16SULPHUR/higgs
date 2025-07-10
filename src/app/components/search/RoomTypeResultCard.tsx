'use client';

import { Users, MapPin, DollarSign } from 'lucide-react';
import styles from './RoomResultCard.module.css';
import Link from 'next/link';

interface RoomTypeResultCardProps {
  roomType: any;
  searchCriteria: {
    date: string;
    startTime: string;
    endTime: string;
    rescheduleBookingId?: string;
  };
}

export default function RoomTypeResultCard({ roomType, searchCriteria }: RoomTypeResultCardProps) {
  const isReschedule = !!searchCriteria.rescheduleBookingId;

  const params = new URLSearchParams({
    date: searchCriteria.date,
    startTime: searchCriteria.startTime,
    endTime: searchCriteria.endTime,
  });

  let confirmationUrl: string;

  if (isReschedule) {
    params.set('originalBookingId', searchCriteria.rescheduleBookingId!);
    params.set('newTypeOfRoomId', roomType.id);
    confirmationUrl = `/dashboard/reschedule/confirm`;
  } else {
    params.set('typeOfRoomId', roomType.id);
    confirmationUrl = `/dashboard/book`;
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