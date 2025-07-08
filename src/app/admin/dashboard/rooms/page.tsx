import Link from 'next/link';
import { api } from '@/lib/apiClient';
import RoomsTable from '@/components/rooms/RoomsTable';
import styles from './RoomsPage.module.css';
import { Plus } from 'lucide-react';

export default async function RoomsPage() { 
  const rooms = await api.get('/api/admin/meeting-rooms', ['rooms']);

  return (
    <div>
      <div className={styles.header}>
        <div>
            <h1 className={styles.title}>Meeting Rooms</h1>
            <p className={styles.description}>View, create, and manage all meeting rooms.</p>
        </div>
        <Link href="/dashboard/rooms/new" className={styles.addButton}>
            <Plus size={16} />
            <span>Add New Room</span>
        </Link>
      </div>
      <div className={styles.tableContainer}>
        <RoomsTable rooms={rooms} />
      </div>
    </div>
  );
}
