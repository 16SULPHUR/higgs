'use client';

import { redirect } from 'next/navigation';
import styles from './LoginPage.module.css';
import AdminLoginForm from '@/components/auth/AdminLoginForm';
import { useEffect } from 'react';
import { getCookie } from '@/lib/cookieUtils';
import { useSessionContext } from '@/contexts/SessionContext';
import { getDecodedToken } from '@/lib/tokenUtils';

export default function LoginPage() {

  const session = useSessionContext();
  console.log("session", session);

  useEffect(() => {
    if (session?.accessToken) {
      const decodedData = getDecodedToken(session?.accessToken);
      console.log("decodedData")
      console.log(decodedData?.type)

      if (decodedData?.type == "admin") {
        redirect('/admin/dashboard');
      }

      redirect('/dashboard');
    }
  }
    , [session]);
    
  return (
    <main className={styles.page}>
      <section className={styles.cardWrapper}>
        <a href="/login" className={styles.returnLink}>Back to user portal</a>
        <AdminLoginForm />
      </section>
    </main>
  );
}