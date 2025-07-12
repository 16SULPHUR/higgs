'use client';

import { useState, useEffect, useTransition } from 'react';
import Image from 'next/image';
import { updateOrgProfileAction } from '@/actions/orgActions'; 
import styles from '../profile/ProfileForm.module.css';
import { Building, Mail, Save } from 'lucide-react';

export default function OrgProfileForm({ initialData }: { initialData: any }) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [formData, setFormData] = useState({ name: '', email: '' });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (initialData) {
            setFormData({ name: initialData.name || '', email: initialData.email || '' });
            if (initialData.logo_image_url) {
                setImagePreview(initialData.logo_image_url);
            }
        }
    }, [initialData]);

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try { 
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        } catch (err) {
            setError('Failed to process image.');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        startTransition(async () => {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('email', formData.email);
            if (imageFile) {
                data.append('logo_image', imageFile);
            }

            console.log(data)
            const result = await updateOrgProfileAction(data);
            if (result.success) {
                setSuccess(result.message);
            } else {
                setError(result.message);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.profileHeader}>
                <div className={styles.avatarContainer}>
                    {imagePreview ? (
                        <Image src={imagePreview} alt="Organization Logo" width={100} height={100} className={styles.avatar} style={{borderRadius: 'var(--radius)'}}/>
                    ) : (
                        <div className={styles.avatarFallback} style={{borderRadius: 'var(--radius)'}}><Building size={48} /></div>
                    )}
                    <label htmlFor="logo_image" className={styles.avatarEditButton}>Change</label>
                    <input id="logo_image" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                </div>
                <div className={styles.headerInfo}>
                    <h2 className={styles.userName}>{initialData.name}</h2>
                    <p className={styles.userEmail}>Organization Profile</p>
                </div>
            </div>

            <div className={styles.formContent}>
                <div className={styles.inputGroup}>
                    <label htmlFor="name">Organization Name</label>
                    <div className={styles.inputWrapper}><Building size={18} className={styles.inputIcon} /><input id="name" name="name" type="text" value={formData.name} onChange={handleTextChange} required className={styles.input} /></div>
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="email">Organization Email</label>
                    <div className={styles.inputWrapper}><Mail size={18} className={styles.inputIcon} /><input id="email" name="email" type="email" value={formData.email} onChange={handleTextChange} className={styles.input} /></div>
                </div>
            </div>

            <div className={styles.formFooter}>
                {error && <p className={styles.messageText} style={{ color: 'hsl(var(--destructive))' }}>{error}</p>}
                {success && <p className={styles.messageText} style={{ color: 'hsl(var(--primary))' }}>{success}</p>}
                <button type="submit" disabled={isPending} className={styles.saveButton}>
                    <Save size={16} />
                    <span>{isPending ? 'Saving...' : 'Save Changes'}</span>
                </button>
            </div>
        </form>
    );
}