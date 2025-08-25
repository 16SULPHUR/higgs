'use client';

import { redirect } from 'next/navigation';
import styles from './LoginPage.module.css';
import Image from 'next/image';
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
      <section className={styles.shell}>
        <div className={styles.leftPane}>
          <a href="/login" className={styles.returnLink}>Back to user portal</a>
          <div className={styles.formWrapper}>
            <h1 className={styles.heading}>Admin Login</h1>
            <p className={styles.subheading}>Sign in to manage locations, rooms, and events.</p>
            <AdminLoginForm />
          </div>
        </div>
        <div className={styles.rightPane}>
          <div className={styles.heroCard}>
            <Image src="/login_hero_image_desktop.png" alt="Admin login hero" fill sizes="(max-width: 1024px) 100vw, 50vw" priority className={styles.heroImage} />
            <div className={styles.heroOverlay} />
          </div>
        </div>
      </section>
    </main>
  );
}