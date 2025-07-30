'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { User, Mail, Phone, Save } from 'lucide-react';
import styles from './ProfileForm.module.css';
import { api } from '@/lib/api.client';
import { getCookie, setCookie } from '@/lib/cookieUtils'; // Import setCookie
import { useSessionContext } from '@/contexts/SessionContext';

export default function ProfileForm() {
  const session = useSessionContext()
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProfile = async () => {
      const accessToken = getCookie('accessToken');
      if (!accessToken) {
        setError('You are not logged in.');
        return;
      }

      try {
        const data = await api.get(session, '/api/auth/me');

        console.log(data);
        
        setProfile(data);
        setFormData({ name: data.name || '', phone: data.phone || '' });
        if (data.profile_picture) {
          setImagePreview(data.profile_picture);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load profile.');
      }
    };

    fetchProfile();
  }, [session]); // Add session to dependency array if useSessionContext can change.

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

    const accessToken = getCookie('accessToken');
    if (!accessToken) {
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
      // Assuming the patch request returns the updated user data
      const updatedProfile = await api.patch(session, '/api/profile', data);
      setSuccess('Profile updated successfully!');
      
      // Update local profile state
      setProfile(updatedProfile);

      // Update cookies with new profile data
      if (updatedProfile.name) {
        setCookie('name', updatedProfile.name);
      }
      if (updatedProfile.profile_picture) {
        setCookie('profile_picture', updatedProfile.profile_picture);
      } else if (imageFile === null && profile?.profile_picture) {
        // If image was removed (no new file, but old one existed), clear the cookie
        setCookie('profile_picture', ''); // Or deleteCookie('profile_picture');
      }

    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setIsPending(false);
    }
  };

  if (!profile && !error) {
    // Corrected loading div style based on original component's loading state
    return (
        <div style={{ padding: '4rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          Loading...
        </div>
    );
  }

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
          <h2 className={styles.userName}>{profile?.name}</h2>
          <p className={styles.userEmail}>{profile?.email}</p>
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
              value={profile?.email || ''}
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
        <button type="submit" disabled={isPending} className={styles.saveButton}>
          <Save size={16} />
          <span>{isPending ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>
    </form>
  );
}