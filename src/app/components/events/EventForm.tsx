'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { api } from '@/lib/api.client'; 
import styles from '@/components/rooms/RoomForm.module.css';
import imageStyles from './EventForm.module.css';
import { useSessionContext } from '@/contexts/SessionContext';

export default function EventForm({ initialData }: { initialData?: any }) {
    const session = useSessionContext()
    const router = useRouter(); 
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [statusText, setStatusText] = useState('');

    const [formData, setFormData] = useState({ title: '', description: '', date: '' });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (initialData) {
            const localDate = new Date(initialData.date).toISOString().slice(0, 16);
            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                date: localDate,
            });
            if (initialData.image_url) {
                setImagePreview(initialData.image_url);
            }
        }
    }, [initialData]);

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setStatusText('Compressing...');
        try { 
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        } catch (err) {
            setError('Failed to process image.');
        } finally {
            setStatusText('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsPending(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('date', new Date(formData.date).toISOString());
        if (imageFile) {
            data.append('eventImage', imageFile);
        }

        const endpoint = initialData ? `/api/admin/events/${initialData.id}` : '/api/admin/events';
        const method = initialData ? 'patch' : 'post';

        try {
            await api[method](session, endpoint, data);
            // alert(`Event ${initialData ? 'updated' : 'created'} successfully!`);
            router.push('/admin/dashboard/events');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsPending(false);
        }
    };

    const isProcessing = isPending || statusText !== '';

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={imageStyles.formContent}>
                <div className={styles.formGrid}>
                    <div className={`${styles.inputGroup} ${styles.fullWidth}`}><label htmlFor="title">Event Title</label><input id="title" name="title" type="text" value={formData.title} onChange={handleTextChange} required className={styles.input} disabled={isProcessing} /></div>
                    <div className={`${styles.inputGroup} ${styles.fullWidth}`}><label htmlFor="date">Event Date and Time</label><input id="date" name="date" type="datetime-local" value={formData.date} onChange={handleTextChange} required className={styles.input} disabled={isProcessing} /></div>
                    <div className={`${styles.inputGroup} ${styles.fullWidth}`}><label htmlFor="description">Description</label><textarea id="description" name="description" value={formData.description} onChange={handleTextChange} required rows={8} disabled={isProcessing} className={styles.input}></textarea></div>
                </div>
                <div className={imageStyles.imageUploader}>
                    <label htmlFor="eventImage">Event Image</label>
                    <div className={imageStyles.imagePreview}>
                        {statusText === 'Compressing...' ? <span>Compressing...</span> : imagePreview ? <Image src={imagePreview} alt="Preview" fill style={{ objectFit: 'cover' }} /> : <span>Image Preview</span>}
                    </div>
                    <input type="file" id="eventImage" name="eventImage" accept="image/*" onChange={handleImageChange} disabled={isProcessing} className={styles.input} />
                </div>
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.formActions}>
                <button type="button" onClick={() => router.back()} disabled={isProcessing} className={`${styles.button} ${styles.secondary}`}>Cancel</button>
                <button type="submit" disabled={isProcessing} className={styles.button}>{isPending ? 'Saving...' : (initialData ? 'Update Event' : 'Create Event')}</button>
            </div>
        </form>
    );
}