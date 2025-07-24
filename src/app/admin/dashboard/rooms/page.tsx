'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { api } from '@/lib/api.client';
import { Plus, Loader2 } from 'lucide-react'; 
import TableSkeleton from '@/components/common/TableSkeleton';
import styles from './RoomsPage.module.css';
import RoomsTable from '@/components/rooms/RoomsTable';

export default function RoomsInstancesPage() {
    const { status } = useSession();
    const [rooms, setRooms] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const data = await api.get('/api/admin/rooms');
            setRooms(data);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (status === 'authenticated') {
            fetchData();
        }
    }, [status]);
    
    return (
        <div>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Room Instances</h1>
                    <p className={styles.description}>Manage individual physical rooms available for booking.</p>
                </div>
                <a href="/admin/dashboard/rooms/new" className={styles.addButton}>
                    <Plus size={16} />
                    <span>Add New Room</span>
                </a>
            </div>
            <div className={styles.tableContainer}>
                {isLoading ? <TableSkeleton cols={5} /> : <RoomsTable rooms={rooms} onUpdate={fetchData} />}
            </div>
        </div>
    );
}