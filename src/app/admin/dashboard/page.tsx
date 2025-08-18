"use client";

import { useEffect, useState } from 'react';
import { redirect, useRouter } from 'next/navigation';
import styles from './Dashboard.module.css';
import { UserPlus, PlusCircle, MapPin } from 'lucide-react';
import { useSessionContext } from '@/contexts/SessionContext';
import { getDecodedToken } from '@/lib/tokenUtils';
import { getCookie } from '@/lib/cookieUtils';

export default function AdminDashboardPage() {
  const router = useRouter();
  const session = useSessionContext();

  const [mounted, setMounted] = useState(false); 


  useEffect(() => {
    setMounted(true);
  }, [session]);

  const userName = mounted ? (getCookie('name') || '') : '';
  const role: string = mounted ? (getCookie('role') || '') : ('');

  useEffect(() => {
    if (session === undefined) {
      return;
    }

    if (session === null) {
      router.replace('/login');
      return;
    }

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

 if (session === null) {
    return null;
  }

  return (
    <div>
      <header className={styles.header}>
        <div className={styles.welcomeMessage}>
          <h1 className={styles.welcomeTitle}>Admin Dashboard</h1>
          <p className={styles.welcomeText}>Welcome back, {userName}! Here is the platform overview.</p>
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

          {role === 'SUPER_ADMIN' && <a href="/admin/dashboard/location-admins/new" className={styles.actionCard}>
            <MapPin size={24} className={styles.actionIcon} />
            <h3 className={styles.actionTitle}>Add Location Admin</h3>
            <p className={styles.actionDescription}>Create a new location administrator for a specific location.</p>
          </a>}

        </div>
      </div> 
    </div>
  );
}