'use client';

import { redirect } from 'next/navigation';
import styles from './LoginPage.module.css';
import { getSession } from '@/lib/session';
import AdminLoginForm from '@/components/auth/AdminLoginForm';
import { useSessionContext } from '@/contexts/SessionContext';
import { useEffect } from 'react';
import { getCookie } from '@/lib/cookieUtils';

export default function LoginPage() {
  const session = getCookie("accessToken");

  useEffect(() => {
    if (session) {
      redirect('/admin/dashboard');
    }
  }
    , [session]);

  // if (session) {
  //   redirect('/dashboard');
  // }
  return (
    <main className={styles.container}>
      <AdminLoginForm />
    </main>
  );
}