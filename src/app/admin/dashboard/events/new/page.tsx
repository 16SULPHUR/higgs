'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react'; 
import EventForm from '@/components/events/EventForm';

export default function NewEventPage() {
  return (
    <div>
        <a href="/admin/dashboard/events" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', marginBottom: '1.5rem'}}>
            <ArrowLeft size={16} />
            Back to Events
        </a>
        <h1 style={{fontSize: '1.75rem', fontWeight: 700, marginBottom: '2rem'}}>
            Create New Community Event
        </h1>
        <EventForm />
    </div>
  );
}