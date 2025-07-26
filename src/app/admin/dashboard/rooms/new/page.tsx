'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api.client'; 
import styles from '../RoomsPage.module.css';
import RoomForm from '@/components/rooms/RoomForm';
import { useSessionContext } from '@/contexts/SessionContext';

export default function NewRoomPage() {
    const session = useSessionContext();
    const [roomTypes, setRoomTypes] = useState([]);
    useEffect(() => {
        api.get('/api/admin/room-types').then(setRoomTypes);
    }, []);

    return (
        <div>
            <div className={styles.header}>
                <div>
                    <a href="/admin/dashboard/rooms" className={styles.backButton}><ArrowLeft size={16} /><span>Back to Room Instances</span></a>
                    <h1 className={styles.title}>Create New Room Instance</h1>
                    <p className={styles.description}>Create a physical, bookable room based on a predefined room type.</p>
                </div>
            </div>
            {roomTypes.length > 0 ? <RoomForm session={session} roomTypes={roomTypes} /> : <p>Loading room types...</p>}
        </div>
    );
}