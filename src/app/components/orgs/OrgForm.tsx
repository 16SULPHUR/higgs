'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api.client';
import styles from '@/components/rooms/RoomForm.module.css';

export default function OrgForm({ plans, initialData, onUpdate, session }: { plans: any[], initialData?: any, onUpdate?: () => void, session: any }) {
    const router = useRouter();
    const [formData, setFormData] = useState({ name: '', plan_id: '' });
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({ name: initialData.name, plan_id: initialData.plan_id || '' });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        
        try {
            if (initialData) {
                await api.patch(session, `/api/admin/orgs/${initialData.id}`, formData);
                alert('Organization updated successfully!');
                if (onUpdate) onUpdate();
            } else {
                await api.post(session, '/api/admin/orgs', formData);
                alert('Organization created successfully!');
                router.push('/admin/dashboard/organizations');
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
                <div className={styles.inputGroup}><label htmlFor="name">Organization Name</label><input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required className={styles.input} disabled={isSubmitting} /></div>
                <div className={styles.inputGroup}><label htmlFor="plan_id">Subscription Plan</label><select id="plan_id" name="plan_id" value={formData.plan_id} onChange={handleChange} required className={styles.input} disabled={isSubmitting}><option value="" disabled>Select a plan...</option>{plans.map(plan => <option key={plan.id} value={plan.id}>{plan.name}</option>)}</select></div>
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.formActions}>
                <button type="button" onClick={() => router.back()} className={`${styles.button} ${styles.secondary}`} disabled={isSubmitting}>Cancel</button>
                <button type="submit" className={styles.button} disabled={isSubmitting}>{isSubmitting ? 'Saving...' : (initialData ? 'Update' : 'Create')}</button>
            </div>
        </form>
    );
}