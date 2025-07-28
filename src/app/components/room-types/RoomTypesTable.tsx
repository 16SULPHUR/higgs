'use client';

import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api.client';
import { Pencil, Trash2, Loader2 } from 'lucide-react';
import styles from '../rooms/RoomsTable.module.css';

export default function RoomTypesTable({ roomTypes, locationMap, onUpdate, session }: { roomTypes: any[], locationMap: Map<string, string>, onUpdate: () => void, session:any }) {
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const handleDelete = async (typeId: string, typeName: string) => {
        if (confirm(`Delete "${typeName}"? This will fail if any room instances are using this type.`)) {
            setIsDeleting(typeId);
            try {
                await api.delete(session, `/api/admin/room-types/${typeId}`);
                alert('Room type deleted.');
                onUpdate();
            } catch (error: any) {
                alert(`Error: ${error.message}`);
            } finally {
                setIsDeleting(null);
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
                            <button onClick={() => handleDelete(type.id, type.name)} className={`${styles.iconButton} ${styles.deleteButton}`} disabled={!!isDeleting}>
                                {isDeleting === type.id ? <Loader2 size={16} className={styles.spinner}/> : <Trash2 size={16} />}
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}