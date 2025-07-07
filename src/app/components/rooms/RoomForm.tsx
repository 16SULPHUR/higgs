'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import styles from './RoomForm.module.css';
import { saveRoom } from '@/actions/roomActions';


export default function RoomForm({ locations, initialData }: { locations: any[], initialData?: any }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition(); 
    
    const [error, setError] = useState<string | null>(null);

    
    const [formData, setFormData] = useState({
        name: '',
        type_of_room: '',
        location_id: '',
        capacity: '',
        credits_per_booking: '',
        availability: true,
    });

    useEffect(() => {
        if (initialData) {
          
            setFormData({
                name: initialData.name || '',
                type_of_room: initialData.type_of_room || '',
                location_id: initialData.location_id || '',
                capacity: initialData.capacity?.toString() || '',
                credits_per_booking: initialData.credits_per_booking?.toString() || '',
                availability: initialData.availability ?? true,
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        startTransition(async () => {
          
            const payload = {
                ...formData,
                capacity: parseInt(formData.capacity, 10),
                credits_per_booking: parseInt(formData.credits_per_booking, 10),
            };

            
            const result = await saveRoom(payload, initialData?.id);

            if (result.success) {
                alert(result.message);
                router.push('/dashboard/rooms');
            } else {
                setError(result.message);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGrid}>
              
                <div className={styles.inputGroup}>
                    <label htmlFor="name">Room Name</label>
                    <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required className={styles.input} disabled={isPending} />
                </div>



                <div className={styles.inputGroup}>
                    <label htmlFor="type_of_room">Room Type</label>
                    <input id="type_of_room" name="type_of_room" type="text" placeholder="e.g., Conference, Private Office" value={formData.type_of_room} onChange={handleChange} required className={styles.input} disabled={isPending} />
                </div>


                <div className={styles.inputGroup}>
                    <label htmlFor="capacity">Capacity</label>
                    <input id="capacity" name="capacity" type="number" value={formData.capacity} onChange={handleChange} required className={styles.input} disabled={isPending} />
                </div>


                <div className={styles.inputGroup}>
                    <label htmlFor="credits_per_booking">Credits Per Booking</label>
                    <input id="credits_per_booking" name="credits_per_booking" type="number" value={formData.credits_per_booking} onChange={handleChange} required className={styles.input} disabled={isPending} />
                </div>


                <div className={styles.inputGroup}>
                    <label htmlFor="location_id">Location</label>
                    <select id="location_id" name="location_id" value={formData.location_id} onChange={handleChange} required className={styles.input} disabled={isPending}>
                        <option value="" disabled>Select a location</option>
                        {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
                    </select>
                </div>


                <div className={styles.checkboxGroup}>
                    <input id="availability" name="availability" type="checkbox" checked={formData.availability} onChange={handleChange} className={styles.checkbox} disabled={isPending} />
                    <label htmlFor="availability">Room is active and bookable</label>
                </div>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.formActions}>
                <button type="button" onClick={() => router.back()} className={`${styles.button} ${styles.secondary}`} disabled={isPending}>Cancel</button>
                <button type="submit" className={styles.button} disabled={isPending}>
                    {isPending ? 'Saving...' : (initialData ? 'Update Room' : 'Create Room')}
                </button>
            </div>
        </form>
    );
}