import { useState } from 'react';
import styles from './GuestRegistrationForm.module.css';
import { Loader2 } from 'lucide-react';

export default function GuestRegistrationForm({ eventId, onBack }: { eventId: string, onBack: () => void }) {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const result = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/public/events/${eventId}/register-guest`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await result.json();
            if (!result.ok) {
                // If the response is not ok, throw an error with the message from the JSON body
                throw new Error(data.message || 'An unknown error occurred.');
            }
            setSuccess(data.message || 'You have been successfully registered!');

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className={styles.successMessage}>
                <h3>Thank You!</h3>
                <p>{success}</p>
                <button type="button" onClick={onBack} className={styles.backButton}>Back</button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h3 className={styles.title}>Register as a Guest</h3>
            <div className={styles.inputGroup}>
                <label htmlFor="guest-name">Full Name</label>
                <input id="guest-name" name="name" value={formData.name} placeholder="Jane Doe" required onChange={handleChange} disabled={isSubmitting} />
            </div>
            <div className={styles.inputGroup}>
                <label htmlFor="guest-email">Email Address</label>
                <input id="guest-email" name="email" type="email" value={formData.email} placeholder="jane.doe@example.com" required onChange={handleChange} disabled={isSubmitting} />
            </div>
            <div className={styles.inputGroup}>
                <label htmlFor="guest-phone">Phone (Optional)</label>
                <input id="guest-phone" name="phone" type="tel" value={formData.phone} placeholder="Your contact number" onChange={handleChange} disabled={isSubmitting} />
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.actions}>
                <button type="button" onClick={onBack} disabled={isSubmitting} className={styles.actionButton}>Back</button>
                <button type="submit" disabled={isSubmitting} className={styles.registerButton}>
                    {isSubmitting && <Loader2 size={16} className={styles.spinner} />}
                    {isSubmitting ? 'Registering...' : 'Confirm Registration'}
                </button>
            </div>
        </form>
    );
}