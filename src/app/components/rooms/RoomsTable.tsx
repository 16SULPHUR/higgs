'use client';

import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api.client';
import { Pencil, Trash2, Loader2 } from 'lucide-react';
import styles from './RoomsTable.module.css';

export default function RoomsTable({ rooms, onUpdate }: { rooms: any[], onUpdate: () => void }) {
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const handleDelete = async (roomId: string, roomName: string) => {
        if (confirm(`Are you sure you want to delete the room "${roomName}"?`)) {
            setIsDeleting(roomId);
            try {
                await api.delete(`/api/admin/rooms/${roomId}`);
                alert('Room deleted.');
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
            <thead><tr><th>Instance Name</th><th>Type</th><th>Location</th><th>Status</th><th></th></tr></thead>
            <tbody>
                {rooms.map((room) => (
                    <tr key={room.id}>
                        <td>{room.name}</td>
                        <td>{room.type_name}</td>
                        <td>{room.location_name}</td>
                        <td><span className={room.is_active ? styles.active : styles.inactive}>{room.is_active ? 'Active' : 'Inactive'}</span></td>
                        <td className={styles.actions}>
                            <a href={`/admin/dashboard/rooms/${room.id}/edit`} className={styles.iconButton}><Pencil size={16} /></a>
                            <button onClick={() => handleDelete(room.id, room.name)} className={`${styles.iconButton} ${styles.deleteButton}`} disabled={!!isDeleting}>
                                {isDeleting === room.id ? <Loader2 size={16} className={styles.spinner}/> : <Trash2 size={16} />}
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}