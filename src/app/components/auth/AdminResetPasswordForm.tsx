'use client';

import { useState } from 'react';
import { api } from '@/lib/api.client';
import styles from './AuthForms.module.css';

export default function AdminResetPasswordForm({ email, onPasswordReset }: { email: string, onPasswordReset: () => void }) {
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await api.post(null, '/api/admin/auth/reset-password', { email, token, newPassword });
            onPasswordReset();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>Reset Password (Admin)</h1>
            <p className={styles.description}>Enter the code you received and set a new password.</p>
            <form onSubmit={handleSubmit}>
                <div className={styles.inputGroup}>
                    <label htmlFor="token">Reset Code</label>
                    <input id="token" type="text" value={token} onChange={(e) => setToken(e.target.value)} required disabled={isLoading} />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="newPassword">New Password</label>
                    <input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required disabled={isLoading} />
                </div>
                {error && <p className={styles.error}>{error}</p>}
                <button type="submit" disabled={isLoading} className={styles.button}>
                    {isLoading ? 'Resetting...' : 'Reset Password'}
                </button>
            </form>
        </div>
    );
}


