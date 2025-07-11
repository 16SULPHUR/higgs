import EventForm from '@/components/events/EventForm';
import { api } from '@/lib/apiClient';
import { use } from 'react';

type PageProps = {
  params: {
    id: string;
  };
};

export default async function EditEventPage({params}: {params?: { id?: string }}) {
  const { id } = params;

  const event = await api.get(`/api/admin/events/${id}`);

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '2rem' }}>
        Edit "{event.title}"
      </h1>
      <EventForm initialData={event} />
    </div>
  );
}