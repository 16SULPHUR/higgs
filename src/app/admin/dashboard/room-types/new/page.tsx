import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { api } from '@/lib/apiClient';
import RoomTypeForm from '@/components/room-types/RoomTypeForm';
import styles from '../../rooms/RoomsPage.module.css';

export default async function NewRoomTypePage() {
  // Fetch all available locations to populate the dropdown in the form.
  const locations = await api.get('/api/admin/locations');

  return (
    <div>
      <div className={styles.header}>
        <div>
          <a href="/admin/dashboard/room-types" className={styles.backButton}>
            <ArrowLeft size={16} />
            <span>Back to Room Types</span>
          </a>
          <h1 className={styles.title}>Create New Room Type</h1>
          <p className={styles.description}>
            Define a new blueprint for rooms, including its capacity, cost, and location.
          </p>
        </div>
      </div>
      <RoomTypeForm locations={locations} />
    </div>
  );
}