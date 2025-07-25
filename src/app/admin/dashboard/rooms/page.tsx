'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api.client';
import { Plus, Loader2 } from 'lucide-react'; 
import TableSkeleton from '@/components/common/TableSkeleton';
import styles from './RoomsPage.module.css';
import RoomsTable from '@/components/rooms/RoomsTable';
import { useSessionContext } from '@/contexts/SessionContext';

export default function RoomsInstancesPage() {
  const session = useSessionContext();
  const [rooms, setRooms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!session) {
      // No session - clear rooms and stop loading
      setRooms([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await api(session).get('/api/admin/rooms');
      setRooms(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load rooms.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchData();
    } else {
      // If session disappears, reset state accordingly
      setRooms([]);
      setIsLoading(false);
      setError(null);
    }
  }, [session]);

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Room Instances</h1>
          <p className={styles.description}>
            Manage individual physical rooms available for booking.
          </p>
        </div>
        <a href="/admin/dashboard/rooms/new" className={styles.addButton}>
          <Plus size={16} />
          <span>Add New Room</span>
        </a>
      </div>
      <div className={styles.tableContainer}>
        {isLoading ? (
          <TableSkeleton cols={5} />
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <RoomsTable session={session} rooms={rooms} onUpdate={fetchData} />
        )}
      </div>
    </div>
  );
}
