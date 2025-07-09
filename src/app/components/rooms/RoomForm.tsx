'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { saveRoom } from '@/actions/roomActions';
import styles from './RoomForm.module.css';

export default function RoomForm({ roomTypes, initialData }: { roomTypes: any[], initialData?: any }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
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
        const isCheckbox = type === 'checkbox';
        setFormData(prev => ({ ...prev, [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            const result = await saveRoom(formData, initialData?.id);
            if (result.success) {
                alert(result.message);
                router.push('/admin/dashboard/rooms');
            } else {
                alert(`Error: ${result.message}`);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGrid}>
                <div className={styles.inputGroup}><label>Instance Name</label><input name="name" value={formData.name} onChange={handleChange} required className={styles.input} disabled={isPending} /></div>
                <div className={styles.inputGroup}><label>Room Type</label><select name="type_of_room_id" value={formData.type_of_room_id} onChange={handleChange} required className={styles.input} disabled={isPending}><option value="" disabled>Select...</option>{roomTypes.map(type => <option key={type.id} value={type.id}>{type.name}</option>)}</select></div>
                <div className={styles.checkboxGroup}><input name="is_active" type="checkbox" checked={formData.is_active} onChange={handleChange} className={styles.checkbox} disabled={isPending} /><label>Room is active and bookable</label></div>
            </div>
            <div className={styles.formActions}>
                <button type="button" onClick={() => router.back()} className={`${styles.button} ${styles.secondary}`} disabled={isPending}>Cancel</button>
                <button type="submit" className={styles.button} disabled={isPending}>{isPending ? 'Saving...' : 'Save Instance'}</button>
            </div>
        </form>
    );
}