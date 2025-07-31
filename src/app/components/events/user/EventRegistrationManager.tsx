'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api.client';
import { Check, Loader2, X, UserPlus, LogIn } from 'lucide-react';
import GuestRegistrationForm from './GuestRegistrationForm';
import styles from './EventRegistrationManager.module.css';
import { useSessionContext } from '@/contexts/SessionContext';

export default function EventRegistrationManager({ eventId }: { eventId: string }) {
    const session = useSessionContext(); 
    const [isRegistered, setIsRegistered] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showGuestForm, setShowGuestForm] = useState(false);

    useEffect(() => {
        console.log(session)
        if (session) {
            api.get(session, `/api/events/${eventId}/registration-status`)
                .then(data => setIsRegistered(data.is_registered))
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(true);
        }
    }, [eventId, session]);

    const handleRegister = async () => {
        setIsSubmitting(true);
        try {
            await api.post(session, `/api/events/${eventId}/register`, {});
            setIsRegistered(true);
        } catch (error) {
            alert('Registration failed.');
        }
        setIsSubmitting(false);
    };

    const handleWithdraw = async () => {
        if (confirm("Are you sure you want to withdraw?")) {
            setIsSubmitting(true);
            try {
                await api.delete(session, `/api/events/${eventId}/cancel-registration`);
                setIsRegistered(false);
            } catch (error) {
                alert('Withdrawal failed.');
            }
            setIsSubmitting(false);
        }
    };

    if (session === undefined) {
        return <div className={styles.loadingPlaceholder}></div>;
    }

    if (session) {
        if (isRegistered) {
            return (
                <button onClick={handleWithdraw} disabled={isSubmitting} className={`${styles.actionButton} ${styles.withdrawButton}`}>
                    {isSubmitting ? <Loader2 size={16} className={styles.spinner} /> : <X size={16} />}
                    <span>{isSubmitting ? 'Withdrawing...' : 'Withdraw'}</span>
                </button>
            );
        }
        return (
            <button onClick={handleRegister} disabled={isSubmitting} className={`${styles.actionButton} ${styles.registerButton}`}>
                {isSubmitting ? <Loader2 size={16} className={styles.spinner} /> : <Check size={16} />}
                <span>{isSubmitting ? 'Registering...' : 'Register'}</span>
            </button>
        );
    }

    if (showGuestForm) {
        return <GuestRegistrationForm eventId={eventId} onBack={() => setShowGuestForm(false)} />;
    }

    return (
        <div className={styles.loggedOutActions}>
            <a href="/login" className={`${styles.actionButton} ${styles.signInButton}`}>
                <LogIn size={16} /><span>Sign In to Register</span>
            </a>
            <button onClick={() => setShowGuestForm(true)} className={`${styles.actionButton} ${styles.guestButton}`}>
                <UserPlus size={16} /><span>Register as Guest</span>
            </button>
        </div>
    );
}