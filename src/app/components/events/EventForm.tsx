'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { saveEvent } from '@/actions/eventActions';
import styles from '../rooms/RoomForm.module.css'; // Re-use the master form styles
import imageStyles from './EventForm.module.css'; // Add specific styles for the image uploader

export default function EventForm({ initialData }: { initialData?: any }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    // State for all form fields, including file and preview
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
            if (initialData.eventImage) {
                setImagePreview(initialData.eventImage);
            }
        }
    }, [initialData]);

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            // Create a temporary URL for client-side preview
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        startTransition(async () => {
            const data: any = {
                title: formData.title,
                description: formData.description,
                date: new Date(formData.date).toISOString(),
            };
            if (imageFile) {
                data.eventImage = imageFile;
            }

            const result = await saveEvent(data, initialData?.id);

            if (result.success) {
                alert(result.message);
                router.push('/dashboard/events');
            } else {
                setError(result.message);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={imageStyles.formContent}>
                {/* Left side with text inputs */}
                <div className={styles.formGrid}>
                    <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                        <label htmlFor="title">Event Title</label>
                        <input id="title" name="title" type="text" value={formData.title} onChange={handleTextChange} required className={styles.input} disabled={isPending} />
                    </div>
                    <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                        <label htmlFor="date">Event Date and Time</label>
                        <input id="date" name="date" type="datetime-local" value={formData.date} onChange={handleTextChange} required className={styles.input} disabled={isPending} />
                    </div>
                    <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                        <label htmlFor="description">Description</label>
                        <textarea id="description" name="description" value={formData.description} onChange={handleTextChange} required className={styles.input} rows={8} disabled={isPending}></textarea>
                    </div>
                </div>

                <div className={imageStyles.imageUploader}>
                    <label htmlFor="eventImage">Event Image</label>
                    <div className={imageStyles.imagePreview}>
                        {imagePreview ? (
                            <Image src={imagePreview} alt="Event image preview" fill style={{ objectFit: 'cover' }} className={imageStyles.imagePreview} />
                        ) : (
                            <span>Image Preview</span>
                        )}
                    </div>
                    <input id="eventImage" name="eventImage" type="file" accept="image/png, image/jpeg, image/webp" onChange={handleImageChange} className={styles.input} disabled={isPending} />
                </div>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.formActions}>
                <button type="button" onClick={() => router.back()} className={`${styles.button} ${styles.secondary}`} disabled={isPending}>Cancel</button>
                <button type="submit" className={styles.button} disabled={isPending}>
                    {isPending ? 'Saving...' : (initialData ? 'Update Event' : 'Create Event')}
                </button>
            </div>
        </form>
    );
}