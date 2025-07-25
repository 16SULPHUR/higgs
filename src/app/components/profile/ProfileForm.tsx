'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { api } from '@/lib/api.client';
import styles from './ProfileForm.module.css';
import { User, Mail, Phone, Save } from 'lucide-react';
import { useSessionContext } from '@/contexts/SessionContext';

export default function ProfileForm({ initialData }: { initialData: any }) {
  const session = useSessionContext();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({ name: initialData.name || '', phone: initialData.phone || '' });
      if (initialData.profile_picture) {
        setImagePreview(initialData.profile_picture);
      }
    }
  }, [initialData]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } catch {
      setError('Failed to process image.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsPending(true);

    if (!session) {
      setError('You must be logged in to update your profile.');
      setIsPending(false);
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('phone', formData.phone);
    if (imageFile) {
      data.append('profile_picture', imageFile);
    }

    try {
      const updatedUser = await api(session).patch('/api/profile', data);
      setSuccess('Profile updated successfully!'); 
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.profileHeader}>
        <div className={styles.avatarContainer}>
          {imagePreview ? (
            <Image
              src={imagePreview}
              alt="Profile Picture"
              width={100}
              height={100}
              className={styles.avatar}
            />
          ) : (
            <div className={styles.avatarFallback}>
              <User size={48} />
            </div>
          )}
          <label htmlFor="profile_picture" className={styles.avatarEditButton}>
            Change
          </label>
          <input
            id="profile_picture"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
        </div>
        <div className={styles.headerInfo}>
          <h2 className={styles.userName}>{session?.user?.name || initialData.name}</h2>
          <p className={styles.userEmail}>{initialData.email}</p>
        </div>
      </div>

      <div className={styles.formContent}>
        <div className={styles.inputGroup}>
          <label htmlFor="name">Full Name</label>
          <div className={styles.inputWrapper}>
            <User size={18} className={styles.inputIcon} />
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleTextChange}
              required
              className={styles.input}
            />
          </div>
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="email">Email Address</label>
          <div className={styles.inputWrapper}>
            <Mail size={18} className={styles.inputIcon} />
            <input
              id="email"
              name="email"
              type="email"
              value={initialData.email}
              disabled
              className={styles.input}
              title="Email cannot be changed."
            />
          </div>
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="phone">Phone Number</label>
          <div className={styles.inputWrapper}>
            <Phone size={18} className={styles.inputIcon} />
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleTextChange}
              className={styles.input}
            />
          </div>
        </div>
      </div>

      <div className={styles.formFooter}>
        {error && (
          <p className={styles.messageText} style={{ color: 'hsl(var(--destructive))' }}>
            {error}
          </p>
        )}
        {success && (
          <p className={styles.messageText} style={{ color: 'hsl(var(--primary))' }}>
            {success}
          </p>
        )}
        <button
          type="submit"
          disabled={isPending || !session}
          className={styles.saveButton}
        >
          <Save size={16} />
          <span>{isPending ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>
    </form>
  );
}
