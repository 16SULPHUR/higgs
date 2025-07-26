'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api.client';
import styles from './RoomForm.module.css';

export default function RoomForm({ roomTypes, initialData, onUpdate, session }: { roomTypes: any[], initialData?: any, onUpdate?: () => void, session:any }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({ name: '', type_of_room_id: '', is_active: true });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                type_of_room_id: initialData.type_of_room_id || '',
                is_active: initialData.is_active ?? true,
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (initialData) {
                await api.patch(`/api/admin/rooms/${initialData.id}`, formData);
                alert('Room instance updated successfully!');
                if (onUpdate) onUpdate();
            } else {
                await api.post('/api/admin/rooms', formData);
                alert('Room instance created successfully!');
                router.push('/admin/dashboard/rooms');
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
                <div className={styles.inputGroup}><label>Instance Name</label><input name="name" value={formData.name} onChange={handleChange} required className={styles.input} disabled={isSubmitting} /></div>
                <div className={styles.inputGroup}><label>Room Type</label><select name="type_of_room_id" value={formData.type_of_room_id} onChange={handleChange} required className={styles.input} disabled={isSubmitting}><option value="" disabled>Select...</option>{roomTypes.map(type => <option key={type.id} value={type.id}>{type.name}</option>)}</select></div>
                <div className={styles.checkboxGroup}><input name="is_active" type="checkbox" checked={formData.is_active} onChange={handleChange} className={styles.checkbox} disabled={isSubmitting} /><label>Room is active and bookable</label></div>
            </div>
            <div className={styles.formActions}>
                <button type="button" onClick={() => router.back()} className={`${styles.button} ${styles.secondary}`} disabled={isSubmitting}>Cancel</button>
                <button type="submit" className={styles.button} disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Instance'}</button>
            </div>
        </form>
    );
}