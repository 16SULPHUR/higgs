'use client';
import { useState, useEffect } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { api } from '@/lib/api.client';
import AdminProfileForm from '@/components/admin/profile/AdminProfileForm';
import styles from './AdminProfilePage.module.css';
import { useSessionContext } from '@/contexts/SessionContext';

export default function AdminProfilePage() {
  const session = useSessionContext();
  const [adminData, setAdminData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) { 
      setIsLoading(false);
      setAdminData(null);
      return;
    }
    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await api.get(session, '/api/admin/profile');
        setAdminData(data);
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
    if (!adminData) {
      return (
        <div className={styles.emptyState}>
          <p>Could not load admin profile.</p>
        </div>
      );
    }
    return <AdminProfileForm />;
  };

  return (
    <div className={styles.container}>
        <a href="/admin/dashboard" className={styles.backButton}>
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </a>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Admin Profile</h1>
          <p className={styles.description}>
            Update your personal details and manage your email address.
          </p>
        </div>
      </div>
      <div className={styles.formContainer}>{renderContent()}</div>
    </div>
  );
}
