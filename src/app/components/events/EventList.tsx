'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api.client';
import { ImageIcon, Pencil, Trash2, Users, Loader2 } from 'lucide-react';
import styles from './EventList.module.css';

interface EventListProps {
  events: any[];
  onUpdate: () => void;
  session: any;
}

export default function EventList({ events, onUpdate, session }: EventListProps) {
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const handleDelete = async (eventId: string, eventTitle: string) => {
        if (confirm(`Are you sure you want to delete the event "${eventTitle}"?`)) {
            setIsDeleting(eventId);
            try {
                await api.delete(session, `/api/admin/events/${eventId}`);
                alert('Event deleted successfully.');
                onUpdate();
            } catch (error: any) {
                alert(`Error: ${error.message}`);
            } finally {
                setIsDeleting(null);
            }
        }
    };
    
    return (
        <div className={styles.grid}>
            {events.map((event) => (
                <div key={event.id} className={styles.eventCard}>
                    <div className={styles.imageContainer}>
                        {event.image_url ? (
                            <Image src={event.image_url} alt={event.title} fill style={{ objectFit: 'cover' }} />
                        ) : (
                            <div className={styles.imagePlaceholder}><ImageIcon size={32} /></div>
                        )}
                    </div>
                    <div className={styles.content}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>{event.title}</h2>
                            <p className={styles.cardDate}>
                                {new Date(event.date).toLocaleString('en-US', {
                                    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                })}
                            </p>
                        </div>
                        <p className={styles.cardDescription}>{event.description}</p>
                        <div className={styles.cardFooter}>
                            <a href={`/admin/dashboard/events/${event.id}/registrations`} className={styles.footerLink}>
                                <Users size={14} /> {event.registration_count || 0} Registrations
                            </a>
                            <div className={styles.actions}>
                                <a href={`/admin/dashboard/events/${event.id}/edit`} className={styles.iconButton} title="Edit">
                                    <Pencil size={16} />
                                </a>
                                <button onClick={() => handleDelete(event.id, event.title)} className={`${styles.iconButton} ${styles.deleteButton}`} title="Delete" disabled={isDeleting === event.id}>
                                    {isDeleting === event.id ? <Loader2 size={16} className={styles.spinner} /> : <Trash2 size={16} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}