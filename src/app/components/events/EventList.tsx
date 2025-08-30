'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api.client';
import { ImageIcon, Pencil, Trash2, Users, Loader2, Calendar } from 'lucide-react';
import styles from './EventList.module.css';

interface EventListProps {
  events: any[];
  onUpdate: () => void;
  session: any;
}

export default function EventList({ events, onUpdate, session }: EventListProps) {
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const formatDate = (d: string) => {
        const date = new Date(d);
        return date.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            timeZone: 'Asia/Kolkata' 
        });
    };

    const truncateDescription = (desc: string, maxLength: number = 120) => {
        if (!desc || desc.length <= maxLength) return desc;
        return desc.substring(0, maxLength).trim() + '...';
    };

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

    const handleCardClick = (eventId: string) => {
        window.location.href = `/admin/dashboard/events/${eventId}/registrations`;
    };
    
    return (
        <div className={styles.grid}>
            {events.map((event) => (
                <div 
                    key={event.id} 
                    className={styles.eventCard}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleCardClick(event.id)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleCardClick(event.id);
                        }
                    }}
                >
                    <div className={styles.imageContainer}>
                        {event.image_url ? (
                            <Image src={event.image_url} alt={event.title} fill style={{ objectFit: 'cover' }} />
                        ) : (
                            <div className={styles.imagePlaceholder}>
                                <Calendar size={48} />
                            </div>
                        )}
                    </div>
                    <div className={styles.content}>
                        <div className={styles.header}>
                            <p className={styles.date}>{formatDate(event.date)}</p>
                            <h3 className={styles.title}>{event.title}</h3>
                        </div>
                        
                        <div className={styles.descriptionContainer}>
                            <p className={styles.description}>
                                {truncateDescription(event.description)}
                            </p>
                        </div>
                        
                        <div className={styles.footer}>
                            <div className={styles.registrations}>
                                <Users size={16} />
                                <span>{event.registration_count || 0} Registration{event.registration_count !== 1 ? 's' : ''}</span>
                            </div>
                            
                            <div className={styles.actions}>
                                <a 
                                    href={`/admin/dashboard/events/${event.id}/edit`} 
                                    className={styles.actionButton} 
                                    title="Edit Event"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Pencil size={16} />
                                </a>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(event.id, event.title);
                                    }} 
                                    className={`${styles.actionButton} ${styles.deleteButton}`} 
                                    title="Delete Event" 
                                    disabled={isDeleting === event.id}
                                >
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