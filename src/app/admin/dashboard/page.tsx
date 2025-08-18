"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './Dashboard.module.css';
import { UserPlus, PlusCircle, MapPin } from 'lucide-react';
import { useSessionContext } from '@/contexts/SessionContext';
import { getDecodedToken } from '@/lib/tokenUtils';

export default function AdminDashboardPage() {
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
      console.log("decodedData", decodedData);
      
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
        Loading admin dashboard...
      </div>
    );
  }

  // Don't render anything if session is null (will redirect)
  if (session === null) {
    return null;
  }

  return (
    <div>
      <header className={styles.header}>
        <div className={styles.welcomeMessage}>
          <h1 className={styles.welcomeTitle}>Admin Dashboard</h1>
          <p className={styles.welcomeText}>Welcome back, {session?.user?.name}! Here is the platform overview.</p>
        </div>
      </header>

      <div className={styles.actionsSection}>
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
        <div className={styles.actionsGrid}>
          <a href="/admin/dashboard/users/new" className={styles.actionCard}>
            <UserPlus size={24} className={styles.actionIcon} />
            <h3 className={styles.actionTitle}>Add New User</h3>
            <p className={styles.actionDescription}>Create a new user account and send them a welcome email.</p>
          </a>
          <a href="/admin/dashboard/organizations/new" className={styles.actionCard}>
            <PlusCircle size={24} className={styles.actionIcon} />
            <h3 className={styles.actionTitle}>Create Organization</h3>
            <p className={styles.actionDescription}>Set up a new organization and assign a plan.</p>
          </a>
          <a href="/admin/dashboard/location-admins/new" className={styles.actionCard}>
            <MapPin size={24} className={styles.actionIcon} />
            <h3 className={styles.actionTitle}>Add Location Admin</h3>
            <p className={styles.actionDescription}>Create a new location administrator for a specific location.</p>
          </a>
        </div>
      </div>
    </div>
  );
}