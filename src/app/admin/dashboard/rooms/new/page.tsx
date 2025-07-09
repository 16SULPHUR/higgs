import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { api } from '@/lib/apiClient';
import RoomForm from '@/components/meeting_rooms/RoomForm';
import styles from '../RoomsPage.module.css';

export default async function NewRoomPage() {
  // Fetch all available room types to populate the dropdown in the form.
  const roomTypes = await api.get('/api/admin/room-types');

  return (
    <div>
      <div className={styles.header}>
        <div>
          <Link href="/admin/dashboard/rooms" className={styles.backButton}>
            <ArrowLeft size={16} />
            <span>Back to Room Instances</span>
          </Link>
          <h1 className={styles.title}>Create New Room Instance</h1>
          <p className={styles.description}>
            Create a physical, bookable room based on a predefined room type.
          </p>
        </div>
      </div>
      <RoomForm roomTypes={roomTypes} />
    </div>
  );
}