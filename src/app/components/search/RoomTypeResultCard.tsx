'use client';

import { Users, DollarSign, MapPin } from 'lucide-react';
import styles from './RoomTypeResultCard.module.css';
import Image from 'next/image';

interface RoomTypeResultCardProps {
    roomType: {
        id: string;
        name: string;
        location_name: string;
        capacity: number;
        credits_per_booking: number;
        room_icon: string;
    };
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
            <div className={styles.imageWrapper}>
                <Image
                    src={roomType.room_icon}
                    alt={roomType.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 160px"
                    className={styles.image}
                    priority={false}
                />
            </div>

            <div className={styles.contentWrapper}>
                <div className={styles.info}>
                    <h3 className={styles.title}>{roomType.name}</h3>
                    <div className={styles.location}>
                        <MapPin size={16} />
                        <span>{roomType.location_name}</span>
                    </div>
                    <div className={styles.capacityHighlight}>
                        <Users size={16} />
                        <span>Up to {roomType.capacity} People</span>
                    </div>
                </div>

                <div className={styles.pricing}>
                    <span className={styles.priceValue}>{roomType.credits_per_booking}</span>
                    <span className={styles.priceLabel}>credits/slot</span>
                </div>

            </div>
            <div className={styles.actions}>
                <a href={finalUrl} className={styles.bookButton}>
                    {isReschedule ? 'Select Room' : 'Book Now'}
                </a>
            </div>
        </div>
    );
}



