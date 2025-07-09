import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { api } from '@/lib/apiClient';
import RoomForm from '@/components/rooms/RoomForm';
import styles from '../../RoomsPage.module.css';
import { use } from 'react';

interface EditRoomPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditRoomPage({ params }: EditRoomPageProps) {
  
  const {id} = use(params)
  const [room, roomTypes] = await Promise.all([
    api.get(`/api/admin/rooms/${id}`),
    api.get('/api/admin/room-types')
  ]);

  return (
    <div>
      <div className={styles.header}>
        <div>
          <Link href="/admin/dashboard/rooms" className={styles.backButton}>
            <ArrowLeft size={16} />
            <span>Back to Room Instances</span>
          </Link>
          <h1 className={styles.title}>Edit "{room.name}"</h1>
          <p className={styles.description}>
            Update the details for this specific room instance.
          </p>
        </div>
      </div>
      <RoomForm roomTypes={roomTypes} initialData={room} />
    </div>
  );
}