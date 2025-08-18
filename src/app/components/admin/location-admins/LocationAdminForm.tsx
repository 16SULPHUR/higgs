'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api.client';
import styles from './LocationAdminForm.module.css';

interface Location {
    id: string;
    name: string;
    address: string;
}

interface LocationAdminFormData {
    name: string;
    email: string;
    phone: string;
    location_id: string;
    is_active: boolean;
}

export default function LocationAdminForm({ 
    initialData, 
    onUpdate, 
    session 
}: { 
    initialData?: any, 
    onUpdate?: () => void, 
    session: any 
}) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [locations, setLocations] = useState<Location[]>([]);
    const [formData, setFormData] = useState<LocationAdminFormData>({
        name: '',
        email: '',
        phone: '',
        location_id: '',
        is_active: true
    });

    const isEditing = !!initialData?.id;

    useEffect(() => {
        fetchLocations();
        if (isEditing && initialData) {
            setFormData({
                name: initialData.name || '',
                email: initialData.email || '',
                phone: initialData.phone || '',
                location_id: initialData.location_id || '',
                is_active: initialData.is_active ?? true,
            });
        }
    }, [initialData, isEditing]);

    const fetchLocations = async () => {
        try {
            const data = await api.get(session, '/api/admin/locations');
            setLocations(data);
        } catch (err: any) {
            setError('Failed to fetch locations: ' + err.message);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value 
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            if (isEditing) {
                await api.put(session, `/api/admin/location-admins/${initialData.id}`, formData);
                alert('Location admin updated successfully.');
                if (onUpdate) onUpdate();
            } else {
                await api.post(session, '/api/admin/location-admins', formData);
                alert('Location admin created successfully.');
                router.push('/admin/dashboard/location-admins');
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
                <div className={styles.formGroup}>
                    <label htmlFor="name">Name *</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className={styles.input}
                        placeholder="Enter full name"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="email">Email *</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={styles.input}
                        placeholder="Enter email address"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="phone">Phone</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="Enter phone number (optional)"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="location_id">Location *</label>
                    <select
                        id="location_id"
                        name="location_id"
                        value={formData.location_id}
                        onChange={handleChange}
                        required
                        className={styles.select}
                    >
                        <option value="">Select a location</option>
                        {locations.map((location) => (
                            <option key={location.id} value={location.id}>
                                {location.name} - {location.address}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            name="is_active"
                            checked={formData.is_active}
                            onChange={handleChange}
                            className={styles.checkbox}
                        />
                        Active
                    </label>
                </div>
            </div>

            {error && (
                <div className={styles.error}>
                    {error}
                </div>
            )}

            <div className={styles.formActions}>
                <button
                    type="button"
                    onClick={() => router.back()}
                    className={styles.cancelButton}
                    disabled={isSubmitting}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Saving...' : (isEditing ? 'Update Location Admin' : 'Create Location Admin')}
                </button>
            </div>
        </form>
    );
}

