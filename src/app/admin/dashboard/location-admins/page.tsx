'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionContext } from '@/contexts/SessionContext';
import LocationAdminsTable from '@/components/admin/location-admins/LocationAdminsTable';
import { getDecodedToken } from '@/lib/tokenUtils';
import styles from './LocationAdminsPage.module.css';

export default function LocationAdminsPage() {
  const router = useRouter();
  const session = useSessionContext();

  useEffect(() => {
    // Wait for session to be loaded (not undefined)
    if (session === undefined) {
      return; // Still loading, don't do anything yet
    }

    // If session is null, user is not authenticated
    if (session === null) {
      router.replace('/login');
      return;
    }

    // Check if user is admin
    try {
      const decodedData = getDecodedToken(session?.accessToken);
      if (decodedData?.type !== "admin") {
        router.replace('/login');
        return;
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      router.replace('/login');
      return;
    }
  }, [session, router]);

  // Show loading while session is being fetched
  if (session === undefined) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#6b7280'
      }}>
        Loading location admins...
      </div>
    );
  }

  // Don't render anything if session is null (will redirect)
  if (session === null) {
    return null;
  }

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Location Admins</h1>
          <p className={styles.description}>
            Manage location administrators who can oversee specific locations within your workspace network.
          </p>
        </div>
      </div>
      <div className={styles.tableContainer}>
        <LocationAdminsTable session={session} />
      </div>
    </div>
  );
}
