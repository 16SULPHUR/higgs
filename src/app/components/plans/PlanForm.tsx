'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api.client';
import styles from '@/components/rooms/RoomForm.module.css';

export default function PlanForm({ initialData, onUpdate, session }: { initialData?: any, onUpdate?: () => void, session: any }) {
    const router = useRouter();
    const [formData, setFormData] = useState({ name: '', plan_credits: '', price: '' });
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                plan_credits: initialData.plan_credits?.toString() || '',
                price: initialData.price?.toString() || '',
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
        try {
            const payload = {
                name: formData.name,
                plan_credits: parseInt(formData.plan_credits),
                price: parseFloat(formData.price),
            };

            if (initialData) {
                await api.patch(`/api/admin/plans/${initialData.id}`, payload);
                alert('Plan updated successfully!');
                if (onUpdate) onUpdate();
            } else {
                await api.post('/api/admin/plans', payload);
                alert('Plan created successfully!');
                router.push('/admin/dashboard/plans');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGrid}>
                <div className={styles.inputGroup}><label htmlFor="name">Plan Name</label><input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required className={styles.input} disabled={isSubmitting} /></div>
                <div className={styles.inputGroup}><label htmlFor="plan_credits">Plan Credits</label><input id="plan_credits" name="plan_credits" type="number" value={formData.plan_credits} onChange={handleChange} required className={styles.input} disabled={isSubmitting} /></div>
                <div className={styles.inputGroup}><label htmlFor="price">Price</label><input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} required className={styles.input} disabled={isSubmitting} /></div>
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.formActions}>
                <button type="button" onClick={() => router.back()} className={`${styles.button} ${styles.secondary}`} disabled={isSubmitting}>Cancel</button>
                <button type="submit" className={styles.button} disabled={isSubmitting}>{isSubmitting ? 'Saving...' : (initialData ? 'Update Plan' : 'Create Plan')}</button>
            </div>
        </form>
    );
}