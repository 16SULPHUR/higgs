'use client';

import { useState, useTransition } from 'react';
import styles from './InviteGuestModal.module.css';
import { Send, X } from 'lucide-react';
import { useSessionContext } from '@/contexts/SessionContext';
import { api } from '@/lib/api.client';  

interface Invitee {
    name: string;
    email: string;
}

export default function InviteGuestModal({ 
    bookingId, 
    isOpen, 
    onClose 
}: { 
    bookingId: string, 
    isOpen: boolean, 
    onClose: () => void 
}) {
    const session = useSessionContext();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Basic validation
        if (!bookingId || !name || !email) {
            setError('All fields are required.');
            return;
        }

        startTransition(async () => {
            try {
                // The backend expects: { invitees: Invitee[] }
                const payload = {
                    invitees: [
                        { name, email }
                    ]
                };

                // Client-side API call
                const result = await api.post(session, `/api/bookings/${bookingId}/invite`, payload);

                // Handle success
                setSuccess(result.message || 'Invite sent successfully!');
                setName('');
                setEmail('');
            } catch (error: any) {
                console.error('Invite sending failed:', error);

                // Handle API error responses
                try {
                    let errorMessage = 'Failed to send invite.';

                    if (error.message) {
                        try {
                            const errorBody = JSON.parse(error.message);
                            errorMessage = errorBody.message || errorMessage;
                        } catch (parseError) {
                            errorMessage = error.message;
                        }
                    }

                    setError(errorMessage);
                } catch (parseError) {
                    setError('A server error occurred while sending the invite.');
                }
            }
        });
    };

    const handleClose = () => { 
        setName('');
        setEmail('');
        setError(null);
        setSuccess(null);
        onClose();
    };

    return (
        <div className={styles.overlay} onClick={handleClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Invite a Guest</h2>
                    <button onClick={handleClose} className={styles.closeButton}>
                        <X size={20}/>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="guestName">Guest Name</label>
                        <input 
                            id="guestName" 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                            disabled={isPending} 
                            className={styles.input} 
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="guestEmail">Guest Email</label>
                        <input 
                            id="guestEmail" 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            disabled={isPending} 
                            className={styles.input} 
                        />
                    </div>
                    
                    {error && (
                        <p className={styles.messageText} style={{color: 'hsl(var(--destructive))'}}>
                            {error}
                        </p>
                    )}
                    {success && (
                        <p className={styles.messageText} style={{color: 'hsl(var(--primary))'}}>
                            {success}
                        </p>
                    )}

                    <button type="submit" className={styles.button} disabled={isPending}>
                        <Send size={16} />
                        <span>{isPending ? 'Sending...' : 'Send Invite'}</span>
                    </button>
                </form>
            </div>
        </div>
    );
}
