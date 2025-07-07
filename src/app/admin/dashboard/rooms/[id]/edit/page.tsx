
import RoomForm from '@/components/rooms/RoomForm';
import { api } from '@/lib/apiClient';

export default async function EditRoomPage({ params }: { params: { id: string } }) {
  // Fetch data in parallel for efficiency
  const [room, locations] = await Promise.all([
    api.get(`/api/admin/meeting-rooms/${params.id}`),
    api.get('/api/admin/locations')
  ]);

  return (
    <div>
      <h1>Edit {room.name}</h1>
      <RoomForm locations={locations} initialData={room} />
    </div>
  );
}