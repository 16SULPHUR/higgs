'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionContext } from '@/contexts/SessionContext';
import { ArrowLeft } from 'lucide-react';
import LocationAdminForm from '@/components/admin/location-admins/LocationAdminForm';
import { getDecodedToken } from '@/lib/tokenUtils';
import styles from '../../rooms/RoomsPage.module.css';

export default function NewLocationAdminPage() {
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
        Loading create location admin page...
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
          <a href="/admin/dashboard/location-admins" className={styles.backButton}>
            <ArrowLeft size={16} />
            <span>Back to Location Admins</span>
          </a>
          <h1 className={styles.title}>Create New Location Admin</h1>
          <p className={styles.description}>
            Create a new location administrator and assign them to a specific location. 
            They will receive an email with their login credentials.
          </p>
        </div>
      </div>
      <LocationAdminForm session={session} />
    </div>
  );
}
