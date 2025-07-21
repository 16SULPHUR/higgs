'use client';

import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';
import { deleteRoomType } from '@/actions/roomTypeActions';
import styles from '../rooms/RoomsTable.module.css';

export default function RoomTypesTable({ roomTypes, locationMap }: { roomTypes: any[], locationMap: Map<string, string> }) {
    const handleDelete = async (typeId: string, typeName: string) => {
        if (confirm(`Delete "${typeName}"? This will fail if any room instances are using this type.`)) {
            const result = await deleteRoomType(typeId);
            if (!result.success) {
                alert(`Error: ${result.message}`);
            } else {
                alert('Room type deleted.');
            }
        }
    };

    return (
        <table className={styles.table}>
            <thead><tr><th>Name</th><th>Location</th><th>Capacity</th><th>Credits</th><th></th></tr></thead>
            <tbody>
                {roomTypes.map((type) => (
                    <tr key={type.id}>
                        <td>{type.name}</td>
                        <td>{locationMap.get(type.location_id) || 'N/A'}</td>
                        <td>{type.capacity}</td>
                        <td>{type.credits_per_booking}</td>
                        <td className={styles.actions}>
                            <a href={`/admin/dashboard/room-types/${type.id}/edit`} className={styles.iconButton}><Pencil size={16} /></a>
                            <button onClick={() => handleDelete(type.id, type.name)} className={`${styles.iconButton} ${styles.deleteButton}`}><Trash2 size={16} /></button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}