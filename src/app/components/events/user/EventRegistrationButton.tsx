'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { api } from '@/lib/api.client';
import { Check, Loader2, X } from 'lucide-react';
import styles from './EventCard.module.css';
import { useSessionContext } from '@/contexts/SessionContext';

export default function EventRegistrationButton({ eventId }: { eventId: string }) {
    const session = useSessionContext();
    const [isRegistered, setIsRegistered] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (session) {
            api.get(`/api/events/${eventId}/registration-status`)
                .then(data => setIsRegistered(data.is_registered))
                .finally(() => setIsLoading(false));
        } else if (!session) {
            setIsLoading(false);
        }
    }, [session, eventId]);

    const handleRegister = async () => {
        setIsSubmitting(true);
        try {
            await api.post(`/api/events/${eventId}/register`, {});
            setIsRegistered(true);
        } catch (error) { alert('Registration failed.'); }
        setIsSubmitting(false);
    };

    const handleWithdraw = async () => {
        if (confirm("Are you sure you want to withdraw?")) {
            setIsSubmitting(true);
            try {
                await api.delete(`/api/events/${eventId}/cancel-registration`);
                setIsRegistered(false);
            } catch (error) { alert('Withdrawal failed.'); }
            setIsSubmitting(false);
        }
    };

    if (!session || isLoading) {
        return <div className={styles.actionButton} style={{ width: '120px' }}><Loader2 size={16} className={styles.spinner} /></div>;
    }

    if (!session) {
        return <a href="/login" className={`${styles.actionButton} ${styles.registerButton}`}>Sign In to Register</a>;
    }

    if (isRegistered) {
        return (
            <button onClick={handleWithdraw} disabled={isSubmitting} className={`${styles.actionButton} ${styles.withdrawButton}`}>
                {isSubmitting ? <Loader2 size={16} className={styles.spinner} /> : <X size={16}/>}
                <span>{isSubmitting ? 'Withdrawing...' : 'Withdraw Registration'}</span>
            </button>
        );
    }

    return (
        <button onClick={handleRegister} disabled={isSubmitting} className={`${styles.actionButton} ${styles.registerButton}`}>
            {isSubmitting ? <Loader2 size={16} className={styles.spinner} /> : <Check size={16}/>}
            <span>{isSubmitting ? 'Registering...' : 'Register Now'}</span>
        </button>
    );
}