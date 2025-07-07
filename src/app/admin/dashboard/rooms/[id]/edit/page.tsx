
import RoomForm from '@/components/rooms/RoomForm';
import { api } from '@/lib/apiClient';
import { use } from 'react';

export default async function EditRoomPage({params}: {params: Promise<{ id: string }>}) {

  const { id } = use(params);

  // Fetch data in parallel for efficiency
  const [room, locations] = await Promise.all([
    api.get(`/api/admin/meeting-rooms/${id}`),
    api.get('/api/admin/locations')
  ]);

  return (
    <div>
      <h1>Edit {room.name}</h1>
      <RoomForm locations={locations} initialData={room} />
    </div>
  );
}