import { api } from '@/lib/apiClient';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProfileForm from '@/components/profile/ProfileForm';
import styles from './ProfilePage.module.css';

export default async function ProfilePage() {
  const liveUserData = await api.get('/api/auth/me');

  return (
    <div className={styles.container}>
      <Link href="/dashboard" className={styles.backButton}>
        <ArrowLeft size={16} />
        <span>Back to Dashboard</span>
      </Link>
      <h1 className={styles.title}>My Profile</h1>
      <p className={styles.description}>
        Update your personal details and manage your profile picture.
      </p>
      <div className={styles.formContainer}>
        <ProfileForm initialData={liveUserData} />
      </div>
    </div>
  );
}