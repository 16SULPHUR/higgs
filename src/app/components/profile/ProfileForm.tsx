'use client';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { User, Mail, Phone, Save, Camera, X, Loader2 } from 'lucide-react';
import styles from './ProfileForm.module.css';
import { api } from '@/lib/api.client';
import { getCookie, setCookie } from '@/lib/cookieUtils';
import { useSessionContext } from '@/contexts/SessionContext';

export default function ProfileForm() {
  const session = useSessionContext();
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    const fetchProfile = async () => {
      const accessToken = getCookie('accessToken');
      if (!accessToken) {
        setError('You are not logged in.');
        return;
      }
      try {
        const data = await api.get(session, '/api/auth/me');
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
  }, [session]);

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

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
      const updatedProfile = await api.patch(session, '/api/profile', data);
      setSuccess('Profile updated successfully!');
      setProfile(updatedProfile);
      if (updatedProfile.name) {
        setCookie('name', updatedProfile.name);
      }
      if (updatedProfile.profile_picture) {
        setCookie('profile_picture', updatedProfile.profile_picture);
      } else if (imageFile === null && profile?.profile_picture) {
        setCookie('profile_picture', '');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setIsPending(false);
    }
  };

  if (!profile && !error) {
    return (
        <div className={styles.loadingContainer}>
          <Loader2 className={styles.loaderIcon} />
          <p>Loading profile...</p>
        </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.profileHeader}>
        <div className={styles.avatarContainer}>
          {imagePreview ? (
            <>
              <Image
                src={imagePreview}
                alt="Profile Picture"
                width={120}
                height={120}
                className={styles.avatar}
              />
              <button 
                type="button"
                className={styles.removeImageButton}
                onClick={removeImage}
              >
                <X size={16} />
              </button>
            </>
          ) : (
            <div className={styles.avatarFallback}>
              <User size={48} />
            </div>
          )}
          <button 
            type="button"
            className={styles.avatarEditButton}
            onClick={triggerFileInput}
          >
            <Camera size={16} />
            <span>Change Photo</span>
          </button>
          <input
            ref={fileInputRef}
            id="profile_picture"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={styles.hiddenInput}
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
              placeholder="Enter your full name"
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
              placeholder="Enter your phone number"
            />
          </div>
        </div>
      </div>
      
      <div className={styles.formFooter}>
        <div className={styles.messageContainer}>
          {error && <p className={styles.errorMessage}>{error}</p>}
          {success && <p className={styles.successMessage}>{success}</p>}
        </div>
        <button 
          type="submit" 
          disabled={isPending} 
          className={styles.saveButton}
        >
          <Save size={16} />
          <span>{isPending ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>
    </form>
  );
}