'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { api } from '@/lib/api.client'; 
import EventForm from '@/components/events/EventForm';
import { useSessionContext } from '@/contexts/SessionContext';

export default function EditEventPage() {
  const params = useParams();
  const session = useSessionContext();

  const eventId = params.id as string | undefined;

  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session || !eventId) {
      // No session or eventId - reset state and stop loading
      setEvent(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    const fetchEvent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await api.get(session, `/api/admin/events/${eventId}`);
        setEvent(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load event details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [session, eventId]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <Loader2 className="animate-spin" />
        </div>
      );
    }
    if (error) {
      return <p>Error: {error}</p>;
    }
    if (event) {
      return <EventForm initialData={event} />;
    }
    return <p>Event not found.</p>;
  };

  return (
    <div>
      <a 
        href="/admin/dashboard/events" 
        style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          fontSize: '0.875rem', 
          marginBottom: '1.5rem'
        }}
      >
        <ArrowLeft size={16} />
        Back to Events
      </a>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '2rem' }}>
        Edit "{event ? event.title : 'Event'}"
      </h1>
      {renderContent()}
    </div>
  );
}
