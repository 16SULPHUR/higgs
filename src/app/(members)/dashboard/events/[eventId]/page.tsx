import Image from 'next/image';
import { ArrowLeft, Calendar, Users } from 'lucide-react';
import styles from './EventDetailPage.module.css';  
import EventRegistrationManager from '@/components/events/user/EventRegistrationManager';

async function getEvent(eventId: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/${eventId}/details`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json();
}

export async function generateStaticParams() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/ids`);
    const events = await res.json();
    return events.map((event: { id: string }) => ({
        eventId: event.id.toString(),
    }));
}

export default async function EventDetailPage({ params }: { params?: { eventId?: string } }) {
    const event = await getEvent(params.eventId) ?? null;
    if (!event) { return <div>Event not found.</div>; }

    const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { dateStyle: 'full', timeZone: 'Asia/Kolkata' });

    return (
        <div className={styles.container}>
            <a href="/dashboard/events" className={styles.backButton}>
                <ArrowLeft size={16} /> Back to All Events
            </a>
            <div className={styles.card}>
                <div className={styles.imageContainer}>
                    {event.image_url ? (
                        <Image src={event.image_url} alt={event.title} fill style={{ objectFit: 'cover' }} />
                    ) : (
                        <div className={styles.imagePlaceholder}><Calendar size={64} /></div>
                    )}
                </div>
                <div className={styles.content}>
                    <h1 className={styles.title}>{event.title}</h1>
                    <div className={styles.meta}>
                        <span className={styles.metaItem}><Calendar size={14} />{formatDate(event.date)}</span>
                        <span className={styles.metaItem}><Users size={14} />{event.registration_count} Registered</span>
                    </div>
                    <p className={styles.description}>{event.description}</p>
                    <div className={styles.actions}>
                        <EventRegistrationManager eventId={event.id} />
                    </div>
                </div>
            </div>
        </div>
    );
}