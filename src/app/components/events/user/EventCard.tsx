'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Calendar, Check, Users, X, Loader2 } from 'lucide-react';
import { api } from '@/lib/api.client';
import styles from './EventCard.module.css';

interface EventCardProps {
  event: any;
  onUpdate: () => void;
  session: any;
}

export default function EventCard({ event, onUpdate, session }: EventCardProps) {
    const [isPending, setIsPending] = useState(false);

    const handleRegister = async () => {
        setIsPending(true);
        try {
            await api.post(session, `/api/events/${event.id}/register`, {});
            onUpdate(); // Trigger a re-fetch of the event list
        } catch (error: any) {
            alert(`Error: ${error.message}`);
        } finally {
            setIsPending(false);
        }
    };

    const handleWithdraw = async () => {
        if (confirm("Are you sure you want to withdraw from this event?")) {
            setIsPending(true);
            try {
                await api.delete(session, `/api/events/${event.id}/cancel-registration`);
                onUpdate(); // Trigger a re-fetch
            } catch (error: any) {
                alert(`Error: ${error.message}`);
            } finally {
                setIsPending(false);
            }
        }
    };

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
                    <a href={`/dashboard/events/${event.id}`}>Details</a>
                    {event.is_registered ? (
                        <button onClick={handleWithdraw} disabled={isPending} className={`${styles.actionButton} ${styles.withdrawButton}`}>
                            {isPending ? <Loader2 size={16} className={styles.spinner} /> : <X size={16}/>}
                            <span>{isPending ? 'Withdrawing...' : 'Withdraw'}</span>
                        </button>
                    ) : (
                        <button onClick={handleRegister} disabled={isPending} className={`${styles.actionButton} ${styles.registerButton}`}>
                            {isPending ? <Loader2 size={16} className={styles.spinner} /> : <Check size={16}/>}
                            <span>{isPending ? 'Registering...' : 'Register'}</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}