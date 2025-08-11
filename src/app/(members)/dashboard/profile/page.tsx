'use client';
import { useState, useEffect } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { api } from '@/lib/api.client';
import ProfileForm from '@/components/profile/ProfileForm';
import styles from './ProfilePage.module.css';
import { useSessionContext } from '@/contexts/SessionContext';

export default function ProfilePage() {
  const session = useSessionContext();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) { 
      setIsLoading(false);
      setUserData(null);
      return;
    }
    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await api.get(session, '/api/auth/me');
        setUserData(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch profile data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [session]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={styles.loadingState}>
          <Loader2 className={styles.loaderIcon} />
          <p>Loading your profile...</p>
        </div>
      );
    }
    if (error) {
      return (
        <div className={styles.errorState}>
          <p>Error: {error}</p>
          <button 
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      );
    }
    if (!userData) {
      return (
        <div className={styles.emptyState}>
          <p>Could not load user profile.</p>
        </div>
      );
    }
    return <ProfileForm />;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <a href="/dashboard" className={styles.backButton}>
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </a>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>My Profile</h1>
          <p className={styles.description}>
            Update your personal details and manage your profile picture.
          </p>
        </div>
      </div>
      <div className={styles.formContainer}>{renderContent()}</div>
    </div>
  );
}