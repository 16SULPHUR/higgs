'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ImageIcon, Pencil, Trash2, Users } from 'lucide-react';
import styles from './EventList.module.css';
import { deleteEvent } from '@/actions/eventActions';

export default function EventList({ events }: { events: any[] }) {
    const handleDelete = async (eventId: string, eventTitle: string) => {
        if (confirm(`Are you sure you want to delete the event "${eventTitle}"?`)) {
            const result = await deleteEvent(eventId);
            if (!result.success) {
                alert(`Error: ${result.message}`);
            } else {
                alert('Event deleted successfully.');
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
                            <div className={styles.imagePlaceholder}>
                                <ImageIcon size={32} />
                            </div>
                        )}
                    </div>
                    <div key={event.id} className={styles.eventCard}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>{event.title}</h2>
                            <p className={styles.cardDate}>
                                {new Date(event.date).toLocaleDateString('en-US', {
                                    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                })}
                            </p>
                        </div>
                        <p className={styles.cardDescription}>{event.description}</p>
                        <div className={styles.cardFooter}>
                            <Link href={`/dashboard/events/${event.id}/registrations`} className={styles.footerLink}>
                                <Users size={14} /> {event.registration_count} Registrations
                            </Link>
                            <div className={styles.actions}>
                                <Link href={`/dashboard/events/${event.id}/edit`} className={styles.iconButton} title="Edit">
                                    <Pencil size={16} />
                                </Link>
                                <button onClick={() => handleDelete(event.id, event.title)} className={`${styles.iconButton} ${styles.deleteButton}`} title="Delete">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}