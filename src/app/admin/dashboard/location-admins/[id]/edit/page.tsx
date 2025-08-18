'use client';

import { useState, useEffect } from 'react';
import { useSessionContext } from '@/contexts/SessionContext';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api.client';
import { getDecodedToken } from '@/lib/tokenUtils';
import LocationAdminForm from '@/components/admin/location-admins/LocationAdminForm';
import styles from '../../../rooms/RoomsPage.module.css';

export default function EditLocationAdminPage() {
  const session = useSessionContext();
  const params = useParams();
  const router = useRouter();
  const [locationAdmin, setLocationAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

    // Only fetch location admin if session is valid
    fetchLocationAdmin();
  }, [session, router]);

  const fetchLocationAdmin = async () => {
    try {
      setLoading(true);
      const data = await api.get(session, `/api/admin/location-admins/${params.id}`);
      setLocationAdmin(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = () => {
    router.push('/admin/dashboard/location-admins');
  };

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
        Loading edit location admin page...
      </div>
    );
  }

  // Don't render anything if session is null (will redirect)
  if (session === null) {
    return null;
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!locationAdmin) return <div>Location admin not found</div>;

  return (
    <div>
      <div className={styles.header}>
        <div>
          <a href="/admin/dashboard/location-admins" className={styles.backButton}>
            <ArrowLeft size={16} />
            <span>Back to Location Admins</span>
          </a>
          <h1 className={styles.title}>Edit Location Admin</h1>
          <p className={styles.description}>
            Update the location administrator's information and location assignment.
          </p>
        </div>
      </div>
      <LocationAdminForm 
        session={session} 
        initialData={locationAdmin} 
        onUpdate={handleUpdate}
      />
    </div>
  );
}
