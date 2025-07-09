'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { saveRoomType } from '@/actions/roomTypeActions';
import styles from '../rooms/RoomForm.module.css';

export default function RoomTypeForm({ locations, initialData }: { locations: any[], initialData?: any }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
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
        startTransition(async () => {
            const result = await saveRoomType(formData, initialData?.id);
            if (result.success) {
                alert(result.message);
                router.push('/admin/dashboard/room-types');
            } else {
                alert(`Error: ${result.message}`);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGrid}>
                <div className={styles.inputGroup}><label>Type Name</label><input name="name" value={formData.name} onChange={handleChange} required className={styles.input} disabled={isPending} /></div>
                <div className={styles.inputGroup}><label>Location</label><select name="location_id" value={formData.location_id} onChange={handleChange} required className={styles.input} disabled={isPending}><option value="" disabled>Select...</option>{locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}</select></div>
                <div className={styles.inputGroup}><label>Capacity</label><input name="capacity" type="number" value={formData.capacity} onChange={handleChange} required className={styles.input} disabled={isPending} /></div>
                <div className={styles.inputGroup}><label>Credits Per Booking</label><input name="credits_per_booking" type="number" value={formData.credits_per_booking} onChange={handleChange} required className={styles.input} disabled={isPending} /></div>
            </div>
            <div className={styles.formActions}>
                <button type="button" onClick={() => router.back()} className={`${styles.button} ${styles.secondary}`} disabled={isPending}>Cancel</button>
                <button type="submit" className={styles.button} disabled={isPending}>{isPending ? 'Saving...' : 'Save Type'}</button>
            </div>
        </form>
    );
}