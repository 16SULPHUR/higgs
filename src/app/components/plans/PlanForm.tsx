'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { savePlan } from '@/actions/planActions';
import styles from '../rooms/RoomForm.module.css'; // Re-use form styles

export default function PlanForm({ initialData }: { initialData?: any }) {
    const router = useRouter();
    const [formData, setFormData] = useState({ name: '', plan_credits: '', price: '' });
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                plan_credits: initialData.plan_credits.toString(),
                price: (initialData.price).toString(),
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const payload = {
            name: formData.name,
            plan_credits: parseInt(formData.plan_credits),
            price: parseFloat(formData.price)
        };

        const result = await savePlan(payload, initialData?.id);

        if (result.success) {
            alert(result.message);
            router.push('/dashboard/plans');
        } else {
            setError(result.message);
        }
        setIsSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                    <label htmlFor="name">Plan Name</label>
                    <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required className={styles.input} disabled={isSubmitting} />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="plan_credits">Plan Credits</label>
                    <input id="plan_credits" name="plan_credits" type="number" value={formData.plan_credits} onChange={handleChange} required className={styles.input} disabled={isSubmitting} />
                </div>
                 <div className={styles.inputGroup}>
                    <label htmlFor="price">Price</label>
                    <input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} required className={styles.input} disabled={isSubmitting} />
                </div>
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.formActions}>
                <button type="button" onClick={() => router.back()} className={`${styles.button} ${styles.secondary}`} disabled={isSubmitting}>Cancel</button>
                <button type="submit" className={styles.button} disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : (initialData ? 'Update Plan' : 'Create Plan')}
                </button>
            </div>
        </form>
    );
}