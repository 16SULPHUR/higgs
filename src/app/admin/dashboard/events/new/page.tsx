import EventForm from '@/components/events/EventForm';

export default function NewEventPage() {
  return (
    <div>
      <h1 style={{fontSize: '1.75rem', fontWeight: 700, marginBottom: '2rem'}}>
        Create New Community Event
      </h1>
      <EventForm />
    </div>
  );
}