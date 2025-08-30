'use client';

import { useState, useEffect } from 'react';
import { useSessionContext } from '@/contexts/SessionContext';
import { useParams } from 'next/navigation';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { api } from '@/lib/api.client';
import { getDecodedToken } from '@/lib/tokenUtils';
import Link from 'next/link';
import styles from './LocationAdminDetailPage.module.css';

interface LocationAdmin {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    is_active: boolean;
    created_at: string;
    location_id: string;
    location_name: string;
    location_address: string;
}

export default function LocationAdminDetailPage() {
  const session = useSessionContext();
  const params = useParams();
  const [locationAdmin, setLocationAdmin] = useState<LocationAdmin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Wait for session to be loaded (not undefined)
    if (session === undefined) {
      return; // Still loading, don't do anything yet
    }

    // If session is null, user is not authenticated
    if (session === null) {
      window.location.href = '/login';
      return;
    }

    // Check if user is admin
    try {
      const decodedData = getDecodedToken(session?.session?.accessToken);
      if (decodedData?.type !== "admin") {
        window.location.href = '/login';
        return;
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      window.location.href = '/login';
      return;
    }

    // Only fetch location admin if session is valid
    fetchLocationAdmin();
  }, [session]);

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

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this location admin?')) {
      return;
    }

    try {
      await api.delete(session, `/api/admin/location-admins/${params.id}`);
      window.location.href = '/admin/dashboard/location-admins';
    } catch (err: any) {
      alert('Failed to delete location admin: ' + err.message);
    }
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
        Loading location admin details...
      </div>
    );
  }

  // Don't render anything if session is null (will redirect)
  if (session === null) {
    return null;
  }

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (!locationAdmin) return <div className={styles.error}>Location admin not found</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <Link href="/admin/dashboard/location-admins" className={styles.backButton}>
            <ArrowLeft size={16} />
            <span>Back to Location Admins</span>
          </Link>
          <h1 className={styles.title}>{locationAdmin.name}</h1>
          <p className={styles.description}>Location Administrator Details</p>
        </div>
        <div className={styles.actions}>
          <Link
            href={`/admin/dashboard/location-admins/${locationAdmin.id}/edit`}
            className={styles.editButton}
          >
            <Edit size={16} />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className={styles.deleteButton}
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h2>Personal Information</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <label>Name</label>
              <span>{locationAdmin.name}</span>
            </div>
            <div className={styles.infoItem}>
              <label>Email</label>
              <span>{locationAdmin.email}</span>
            </div>
            <div className={styles.infoItem}>
              <label>Phone</label>
              <span>{locationAdmin.phone || 'Not provided'}</span>
            </div>
            <div className={styles.infoItem}>
              <label>Role</label>
              <span className={styles.role}>{locationAdmin.role}</span>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2>Location Assignment</h2>
          <div className={styles.locationCard}>
            <h3>{locationAdmin.location_name}</h3>
            {locationAdmin.location_address && (
              <p className={styles.address}>{locationAdmin.location_address}</p>
            )}
          </div>
        </div>

        <div className={styles.section}>
          <h2>Account Status</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <label>Status</label>
              <span className={`${styles.status} ${locationAdmin.is_active ? styles.active : styles.inactive}`}>
                {locationAdmin.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className={styles.infoItem}>
              <label>Created</label>
              <span>{new Date(locationAdmin.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
