import Image from 'next/image';
import { Calendar, Check, Users, X, Loader2 } from 'lucide-react'; 
import styles from './EventCard.module.css';

interface EventCardProps {
  event: any;  
}

export default function EventCard({ event }: EventCardProps) { 
 

    const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { dateStyle: 'full', timeZone: 'Asia/Kolkata' });

    return (
        <div className={styles.eventCard}>
            <div className={styles.imageContainer}>
                {event.image_url ? (
                    <Image src={event.image_url} alt={event.title} fill style={{ objectFit: 'cover' }} />
                ) : (
                    <div className={styles.imagePlaceholder}><Calendar size={48} /></div>
                )}
            </div>
            <div className={styles.content}>
                <p className={styles.date}>{formatDate(event.date)}</p>
                <h3 className={styles.title}>{event.title}</h3>
                <p className={styles.description}>{event.description}</p>
                <div className={styles.footer}>
                    <span className={styles.registrations}><Users size={14} />{event.registration_count} Registered</span>
                    <a href={`/events/${event.id}`}>Details</a>
                    {/* {event.is_registered ? (
                        <button onClick={handleWithdraw} disabled={isPending} className={`${styles.actionButton} ${styles.withdrawButton}`}>
                            {isPending ? <Loader2 size={16} className={styles.spinner} /> : <X size={16}/>}
                            <span>{isPending ? 'Withdrawing...' : 'Withdraw'}</span>
                        </button>
                    ) : (
                        <button onClick={handleRegister} disabled={isPending} className={`${styles.actionButton} ${styles.registerButton}`}>
                            {isPending ? <Loader2 size={16} className={styles.spinner} /> : <Check size={16}/>}
                            <span>{isPending ? 'Registering...' : 'Register'}</span>
                        </button>
                    )} */}
                </div>
            </div>
        </div>
    );
}