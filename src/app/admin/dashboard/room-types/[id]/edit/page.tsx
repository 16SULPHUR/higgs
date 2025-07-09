import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { api } from '@/lib/apiClient';
import RoomTypeForm from '@/components/room-types/RoomTypeForm';
import styles from '../../../rooms/RoomsPage.module.css';
import { use } from 'react';

interface EditRoomTypePageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditRoomTypePage({ params }: EditRoomTypePageProps) {

    const { id } = use(params)
    const [roomType, locations] = await Promise.all([
        api.get(`/api/admin/room-types/${id}`),
        api.get('/api/admin/locations')
    ]);

    return (
        <div>
            <div className={styles.header}>
                <div>
                    <Link href="/admin/dashboard/room-types" className={styles.backButton}>
                        <ArrowLeft size={16} />
                        <span>Back to Room Types</span>
                    </Link>
                    <h1 className={styles.title}>Edit "{roomType.name}"</h1>
                    <p className={styles.description}>
                        Update the details for this room blueprint.
                    </p>
                </div>
            </div>
            <RoomTypeForm locations={locations} initialData={roomType} />
        </div>
    );
}