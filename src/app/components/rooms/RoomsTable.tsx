'use client';

import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';
import { deleteRoom } from '@/actions/roomActions';
import styles from './RoomsTable.module.css';

export default function RoomsTable({ rooms }: { rooms: any[] }) {
    const handleDelete = async (roomId: string, roomName: string) => {
        if (confirm(`Are you sure you want to delete the room "${roomName}"?`)) {
            const result = await deleteRoom(roomId);
            if (!result.success) {
                alert(`Error: ${result.message}`);
            } else {
                alert('Room deleted.');
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
                            <Link href={`/admin/dashboard/rooms/${room.id}/edit`} className={styles.iconButton}><Pencil size={16} /></Link>
                            <button onClick={() => handleDelete(room.id, room.name)} className={`${styles.iconButton} ${styles.deleteButton}`}><Trash2 size={16} /></button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}