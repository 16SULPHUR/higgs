'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api.client';
import { ArrowLeft, Loader2 } from 'lucide-react'; 
import styles from '../../RoomsPage.module.css';
import RoomForm from '@/components/rooms/RoomForm';
import { useSessionContext } from '@/contexts/SessionContext';

export default function EditRoomPage() {
    const session = useSessionContext();
    const params = useParams();
    const [data, setData] = useState<{ room: any, roomTypes: any[] } | null>(null);
    const roomId = params.id as string;

    const fetchData = () => {
        Promise.all([
            api(session).get(`/api/admin/rooms/${roomId}`),
            api(session).get('/api/admin/room-types')
        ]).then(([room, roomTypes]) => setData({ room, roomTypes }));
    };

    useEffect(() => {
        if (roomId) fetchData();
    }, [roomId]);

    if (!data) return <div style={{padding: '4rem', textAlign: 'center'}}><Loader2 className="animate-spin"/></div>;

    return (
        <div>
            <div className={styles.header}>
                <div>
                    <a href="/admin/dashboard/rooms" className={styles.backButton}><ArrowLeft size={16} /><span>Back to Room Instances</span></a>
                    <h1 className={styles.title}>Edit "{data.room.name}"</h1>
                    <p className={styles.description}>Update the details for this specific room instance.</p>
                </div>
            </div>
            <RoomForm session={session} roomTypes={data.roomTypes} initialData={data.room} onUpdate={fetchData} />
        </div>
    );
}