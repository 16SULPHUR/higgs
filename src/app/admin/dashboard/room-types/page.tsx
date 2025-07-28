'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { api } from '@/lib/api.client';
import { Plus, Loader2 } from 'lucide-react'; 
import TableSkeleton from '@/components/common/TableSkeleton';
import styles from '../rooms/RoomsPage.module.css';
import RoomTypesTable from '@/components/room-types/RoomTypesTable';
import { useSessionContext } from '@/contexts/SessionContext';

export default function RoomTypesPage() {
    const session = useSessionContext(); 
    const [data, setData] = useState<{ roomTypes: any[], locations: any[] } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [roomTypesData, locationsData] = await Promise.all([
                api.get(session, '/api/admin/room-types'),
                api.get(session, '/api/admin/locations')
            ]);
            setData({ roomTypes: roomTypesData, locations: locationsData });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (session) {
            fetchData();
        }
    }, [session]);

    const renderContent = () => {
        if (isLoading || session === null) {
            return <div className={styles.tableContainer}><TableSkeleton cols={5} /></div>;
        }
        if (data) {
            const locationMap = new Map(data.locations.map((loc: any) => [loc.id, loc.name]));
            return <div className={styles.tableContainer}><RoomTypesTable session={session} roomTypes={data.roomTypes} locationMap={locationMap} onUpdate={fetchData} /></div>;
        }
        return <p>Failed to load data.</p>;
    };

    return (
        <div>
            <div className={styles.header}>
                <div><h1 className={styles.title}>Room Types</h1><p className={styles.description}>Manage the blueprints for your meeting rooms.</p></div>
                <a href="/admin/dashboard/room-types/new" className={styles.addButton}><Plus size={16} /><span>Add New Type</span></a>
            </div>
            {renderContent()}
        </div>
    );
}