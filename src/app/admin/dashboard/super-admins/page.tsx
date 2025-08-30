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
    if (session === undefined) return;
    if (session === null) {
      router.replace('/admin/login');
      return;
    }
    try {
      const decoded = getDecodedToken(session?.session?.accessToken);
      if (decoded?.type !== 'admin' || decoded?.role !== 'SUPER_ADMIN') {
        router.replace('/admin/dashboard');
        return;
      }
    } catch {
      router.replace('/admin/login');
    }
  }, [session, router]);

  if (session === undefined) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#6b7280' }}>
        Loading super admins...
      </div>
    );
  }
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