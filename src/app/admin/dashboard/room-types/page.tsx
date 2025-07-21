import Link from 'next/link';
import { api } from '@/lib/apiClient';
import RoomTypesTable from '@/components/room-types/RoomTypesTable';
import styles from '../rooms/RoomsPage.module.css';
import { Plus } from 'lucide-react';

export default async function RoomTypesPage() {
  const [roomTypes, locations] = await Promise.all([
      api.get('/api/admin/room-types', ['room-types']),
      api.get('/api/admin/locations')
  ]);

  const locationMap = new Map<string, string>(locations.map((loc: any) => [loc.id.toString(), loc.name.toString()]));

  return (
    <div>
      <div className={styles.header}>
        <div>
            <h1 className={styles.title}>Room Types</h1>
            <p className={styles.description}>Manage the blueprints for your meeting rooms.</p>
        </div>
        <a href="/admin/dashboard/room-types/new" className={styles.addButton}>
            <Plus size={16} />
            <span>Add New Type</span>
        </a>
      </div>
      <div className={styles.tableContainer}>
        <RoomTypesTable roomTypes={roomTypes} locationMap={locationMap} />
      </div>
    </div>
  );
}