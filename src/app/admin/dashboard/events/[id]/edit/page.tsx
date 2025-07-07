import EventForm from '@/components/events/EventForm';
import { api } from '@/lib/apiClient';

type PageProps = {
  params: {
    id: string;
  };
};

export default async function EditEventPage({ params }: PageProps) {
  const event = await api.get(`/api/admin/events/${params.id}`);

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '2rem' }}>
        Edit "{event.title}"
      </h1>
      <EventForm initialData={event} />
    </div>
  );
}