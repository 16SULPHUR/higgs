'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api.client';
import { ArrowLeft, Loader2 } from 'lucide-react';
import styles from '../../../rooms/RoomsPage.module.css';
import RoomTypeForm from '@/components/room-types/RoomTypeForm';
import { useSessionContext } from '@/contexts/SessionContext';

export default function EditRoomTypePage() {
    const session = useSessionContext();
    const params = useParams();
    const [data, setData] = useState<{ roomType: any, locations: any[] } | null>(null);
    const typeId = params.id as string;

    const fetchData = () => {
        Promise.all([
            api.get(`/api/admin/room-types/${typeId}`),
            api.get('/api/admin/locations')
        ]).then(([roomType, locations]) => setData({ roomType, locations }));
    };

    useEffect(() => {
        if (typeId) fetchData();
    }, [typeId]);

    if (!data) return <div style={{ padding: '4rem', textAlign: 'center' }}><Loader2 className="animate-spin" /></div>;

    return (
        <div>
            <div className={styles.header}>
                <div>
                    <a href="/admin/dashboard/room-types" className={styles.backButton}><ArrowLeft size={16} /><span>Back to Room Types</span></a>
                    <h1 className={styles.title}>Edit "{data.roomType.name}"</h1>
                    <p className={styles.description}>Update the details for this room blueprint.</p>
                </div>
            </div>
            <RoomTypeForm session={session} locations={data.locations} initialData={data.roomType} onUpdate={fetchData} />
        </div>
    );
}