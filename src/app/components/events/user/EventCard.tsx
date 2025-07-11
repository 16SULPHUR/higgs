'use client';

import { useTransition } from 'react';
import Image from 'next/image';
import { Calendar, Check, Users, X } from 'lucide-react';
import { registerForEventAction, withdrawFromEventAction } from '@/actions/eventRegistrationActions';
import styles from './EventCard.module.css';

export default function EventCard({ event }: { event: any }) {
    const [isPending, startTransition] = useTransition();

    const handleRegister = () => {
        startTransition(async () => {
            const result = await registerForEventAction(event.id);
            if (!result.success) { alert(`Error: ${result.message}`); }
        });
    };

    const handleWithdraw = () => {
        if (confirm("Are you sure you want to withdraw from this event?")) {
            startTransition(async () => {
                const result = await withdrawFromEventAction(event.id);
                if (!result.success) { alert(`Error: ${result.message}`); }
            });
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
                    {event.is_registered ? (
                        <button onClick={handleWithdraw} disabled={isPending} className={`${styles.actionButton} ${styles.withdrawButton}`}>
                            <X size={16}/><span>{isPending ? 'Withdrawing...' : 'Withdraw'}</span>
                        </button>
                    ) : (
                        <button onClick={handleRegister} disabled={isPending} className={`${styles.actionButton} ${styles.registerButton}`}>
                            <Check size={16}/><span>{isPending ? 'Registering...' : 'Register'}</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}