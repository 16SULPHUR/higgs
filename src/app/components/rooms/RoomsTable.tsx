'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/apiClient';
import { Pencil, Trash2 } from 'lucide-react';
import styles from './RoomsTable.module.css';


const clientApi = {
    delete: async (endpoint: string) => {
        const response = await fetch(endpoint, { method: 'DELETE' });
        if (!response.ok) {
            throw new Error('Failed to delete');
        }
    }
}

export default function RoomsTable({ rooms }: { rooms: any[] }) {
  const router = useRouter();

  const handleDelete = async (roomId: string) => {
    if (confirm('Are you sure you want to delete this room?')) {
      try {
        await clientApi.delete(`/api/rooms/${roomId}`); 
        
        alert('Room deleted successfully.');
        router.refresh();
      } catch (error) {
        alert('Failed to delete room.');
      }
    }
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Capacity</th>
          <th>Credits</th>
          <th>Availability</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {rooms.map((room) => (
          <tr key={room.id}>
            <td>{room.name}</td>
            <td>{room.type_of_room}</td>
            <td>{room.capacity}</td>
            <td>{room.credits_per_booking}</td>
            <td>
              <span className={room.availability ? styles.active : styles.inactive}>
                {room.availability ? 'Available' : 'Unavailable'}
              </span>
            </td>
            <td className={styles.actions}>
              <Link href={`/dashboard/rooms/${room.id}/edit`} className={styles.iconButton}>
                <Pencil size={16} />
              </Link>
              <button onClick={() => handleDelete(room.id)} className={`${styles.iconButton} ${styles.deleteButton}`}>
                <Trash2 size={16} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}