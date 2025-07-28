'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import OrgProfileForm from '@/components/orgs/OrgProfileForm';
import styles from '../profile/ProfilePage.module.css';
import { useSessionContext } from '@/contexts/SessionContext';
import { api } from '@/lib/api.client'; // Use your client-side API utility

export default function ManageOrganizationPage() {
  const session = useSessionContext();
  const [orgData, setOrgData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrgData = async () => {
      if (!session) return;

      try {
        setIsLoading(true);
        setError(null);

        console.log('Fetching organization data...');

        // Client-side API call
        const data = await api.get(session, '/api/orgs/profile');
        setOrgData(data);

      } catch (error: any) {
        console.error('Failed to fetch organization data:', error);

        // Handle API error responses
        try {
          let errorMessage = 'Failed to load organization data.';

          if (error.message) {
            try {
              const errorBody = JSON.parse(error.message);
              errorMessage = errorBody.message || errorMessage;
            } catch (parseError) {
              errorMessage = error.message;
            }
          }

          setError(errorMessage);
        } catch (parseError) {
          setError('Failed to load organization data.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrgData();
  }, [session]);

  // Handle loading state
  if (isLoading) {
    return (
      <div className={styles.container}>
        <a href="/dashboard" className={styles.backButton}>
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </a>
        <h1 className={styles.title}>Manage Organization</h1>
        <div className={styles.loadingContainer}>
          <Loader2 className={styles.loaderIcon} />
          <p>Loading organization data...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className={styles.container}>
        <a href="/dashboard" className={styles.backButton}>
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </a>
        <h1 className={styles.title}>Manage Organization</h1>
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className={styles.retryButton}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Handle case where no data is returned
  if (!orgData) {
    return (
      <div className={styles.container}>
        <a href="/dashboard" className={styles.backButton}>
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </a>
        <h1 className={styles.title}>Manage Organization</h1>
        <div className={styles.emptyState}>
          <p>No organization data found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <a href="/dashboard" className={styles.backButton}>
        <ArrowLeft size={16} />
        <span>Back to Dashboard</span>
      </a>
      <h1 className={styles.title}>Manage Organization</h1>
      <p className={styles.description}>
        Update your organization's details and logo.
      </p>
      <div className={styles.formContainer}>
        <OrgProfileForm
          initialData={orgData}
        />
      </div>
    </div>
  );
}
