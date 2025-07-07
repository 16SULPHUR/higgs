import RoomForm from '@/components/rooms/RoomForm';
import { api } from '@/lib/apiClient';

export default async function NewRoomPage() {
  const locations = await api.get('/api/admin/locations');
  return (
    <div>
      <h1>Create New Meeting Room</h1>
      <RoomForm locations={locations} />
    </div>
  );
}