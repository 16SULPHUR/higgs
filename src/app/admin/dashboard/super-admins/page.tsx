'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionContext } from '@/contexts/SessionContext';
import { getDecodedToken } from '@/lib/tokenUtils';
import styles from './SuperAdminsPage.module.css';
import SuperAdminsTable from '@/components/admin/super-admins/SuperAdminsTable';

export default function SuperAdminsPage() {
  const router = useRouter();
  const session = useSessionContext();

  useEffect(() => {
    // Wait for session to be fully loaded
    if (session === undefined) return;
    
    // If session is null after loading, redirect to login
    if (session === null) {
      router.replace('/admin/login');
      return;
    }

    // Only check permissions if we have a valid session with accessToken
    if (session?.session?.accessToken) {
      try {
        const decoded = getDecodedToken(session.session.accessToken);
        if (decoded?.type !== 'admin' || decoded?.role !== 'SUPER_ADMIN') {
          router.replace('/admin/dashboard');
          return;
        }
      } catch {
        router.replace('/admin/login');
      }
    }
  }, [session, router]);

  // Show loading while session is being fetched
  if (session === undefined) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#6b7280' }}>
        Loading super admins...
      </div>
    );
  }

  // Don't render anything while redirecting
  if (session === null) return null;

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Super Admins</h1>
        </div>
      </div>
      <div className={styles.tableContainer}>
        <SuperAdminsTable session={session} showActions />
      </div>
    </div>
  );
}