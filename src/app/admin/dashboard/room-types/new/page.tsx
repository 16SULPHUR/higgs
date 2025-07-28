'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api.client'; 
import styles from '../../rooms/RoomsPage.module.css';
import RoomTypeForm from '@/components/room-types/RoomTypeForm';
import { useSessionContext } from '@/contexts/SessionContext';

export default function NewRoomTypePage() {
    const session = useSessionContext();
    const [locations, setLocations] = useState([]);
    useEffect(() => {
        api.get(session, '/api/admin/locations').then(setLocations);
    }, []);

    return (
        <div>
            <div className={styles.header}>
                <div>
                    <a href="/admin/dashboard/room-types" className={styles.backButton}><ArrowLeft size={16} /><span>Back to Room Types</span></a>
                    <h1 className={styles.title}>Create New Room Type</h1>
                    <p className={styles.description}>Define a new blueprint for rooms, including capacity, cost, and location.</p>
                </div>
            </div>
            {locations.length > 0 ? <RoomTypeForm session={session} locations={locations} /> : <p>Loading locations...</p>}
        </div>
    );
}