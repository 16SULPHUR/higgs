'use client';

import { redirect } from 'next/navigation';
import styles from './LoginPage.module.css';
import AdminLoginForm from '@/components/auth/AdminLoginForm';
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
    <main className={styles.page}>
      <section className={styles.cardWrapper}>
        <a href="/login" className={styles.returnLink}>Back to user portal</a>
        <AdminLoginForm />
      </section>
    </main>
  );
}