import Image from 'next/image';
import { Calendar, Check, Users, X, Loader2, Edit, Trash2 } from 'lucide-react';
import styles from './EventCard.module.css';

interface EventCardProps {
  event: any;
  onEdit?: (event: any) => void;
  onDelete?: (event: any) => void;
  isAdmin?: boolean;
}

export default function EventCard({ event, onEdit, onDelete, isAdmin = false }: EventCardProps) {
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

    const handleEdit = () => {
        if (onEdit) onEdit(event);
    };

    const handleDelete = () => {
        if (onDelete) onDelete(event);
    };

    return (
        <div className={styles.eventCard}>
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
                        <a href={`/events/${event.id}`} className={styles.detailsLink}>
                            Details
                        </a>
                        
                        {isAdmin && (
                            <>
                                <button 
                                    onClick={handleEdit} 
                                    className={styles.actionButton}
                                    title="Edit Event"
                                >
                                    <Edit size={16} />
                                </button>
                                <button 
                                    onClick={handleDelete} 
                                    className={`${styles.actionButton} ${styles.deleteButton}`}
                                    title="Delete Event"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}