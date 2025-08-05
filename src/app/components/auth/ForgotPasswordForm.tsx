'use client';

import { useState } from 'react';
import { api } from '@/lib/api.client';
import styles from './AuthForms.module.css';

export default function ForgotPasswordForm({ onEmailSubmit }: { onEmailSubmit: (email: string) => void }) {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');
        try {
            const result = await api.post(null, '/api/auth/forgot-password', { email });
            setSuccess(result.message);
            setTimeout(() => onEmailSubmit(email), 1000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>Forgot Password</h1>
            <p className={styles.description}>Enter your email to receive a password reset code.</p>
            <form onSubmit={handleSubmit}>
                <div className={styles.inputGroup}>
                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
                </div>
                {error && <p className={styles.error}>{error}</p>}
                {success && <p className={styles.success}>{success}</p>}
                <button type="submit" disabled={isLoading} className={styles.button}>
                    {isLoading ? 'Sending...' : 'Send Reset Code'}
                </button>
            </form>
        </div>
    );
}