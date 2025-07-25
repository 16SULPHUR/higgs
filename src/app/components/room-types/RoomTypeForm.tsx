'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api.client';
import styles from '../rooms/RoomForm.module.css';

export default function RoomTypeForm({ locations, initialData, onUpdate, session }: { locations: any[], initialData?: any, onUpdate?: () => void, session: any }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({ name: '', capacity: '', credits_per_booking: '', location_id: '' });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                capacity: initialData.capacity?.toString() || '',
                credits_per_booking: initialData.credits_per_booking?.toString() || '',
                location_id: initialData.location_id || '',
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = { ...formData, capacity: parseInt(formData.capacity), credits_per_booking: parseInt(formData.credits_per_booking) };
            if (initialData) {
                await api(session).patch(`/api/admin/room-types/${initialData.id}`, payload);
                alert('Room Type updated successfully!');
                if (onUpdate) onUpdate();
            } else {
                await api(session).post('/api/admin/room-types', payload);
                alert('Room Type created successfully!');
                router.push('/admin/dashboard/room-types');
            }
        } catch (err: any) {
            alert(`Error: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGrid}>
                <div className={styles.inputGroup}><label>Type Name</label><input name="name" value={formData.name} onChange={handleChange} required className={styles.input} disabled={isSubmitting} /></div>
                <div className={styles.inputGroup}><label>Location</label><select name="location_id" value={formData.location_id} onChange={handleChange} required className={styles.input} disabled={isSubmitting}><option value="" disabled>Select...</option>{locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}</select></div>
                <div className={styles.inputGroup}><label>Capacity</label><input name="capacity" type="number" value={formData.capacity} onChange={handleChange} required className={styles.input} disabled={isSubmitting} /></div>
                <div className={styles.inputGroup}><label>Credits Per Booking</label><input name="credits_per_booking" type="number" value={formData.credits_per_booking} onChange={handleChange} required className={styles.input} disabled={isSubmitting} /></div>
            </div>
            <div className={styles.formActions}>
                <button type="button" onClick={() => router.back()} className={`${styles.button} ${styles.secondary}`} disabled={isSubmitting}>Cancel</button>
                <button type="submit" className={styles.button} disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Type'}</button>
            </div>
        </form>
    );
}