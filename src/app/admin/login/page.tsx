'use client';

import { redirect } from 'next/navigation';
import styles from '../../login/LoginPage.module.css';
import Image from 'next/image';
import AdminLoginForm from '@/components/auth/AdminLoginForm';
import { useEffect } from 'react';
import { useSessionContext } from '@/contexts/SessionContext';
import { getDecodedToken } from '@/lib/tokenUtils';

export default function LoginPage() {
  const session = useSessionContext();
  
  useEffect(() => {
    if (session?.session?.accessToken) {
      const decodedData = getDecodedToken(session?.session?.accessToken);
      if (decodedData?.type == 'admin') {
        redirect('/admin/dashboard');
      }
      redirect('/dashboard');
    }
  }, [session]);

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <div className={styles.heroPane}>
          <div className={styles.heroMedia}>
            <Image
              src="/login_hero_image2.png"
              alt="Workspace illustration"
              fill
              sizes="(max-width: 960px) 100vw, 50vw"
              priority
              className={styles.heroImage}
            />
            <div className={styles.heroGradient} />
          </div>
        </div>

        <div className={styles.formPane}>
          <div className={styles.formWrapper}>
            <div className={styles.brand}>
              <Image src="/icons/higgs.png" alt="Higgs logo" width={200} height={70} className={styles.logo} />
            </div>
            <h1 className={styles.heading}>Admin sign in</h1>
            <p className={styles.subheading}>Welcome back.</p>
            <AdminLoginForm />
            <div className={styles.helperRow}>
              <div className={styles.linkRow}><a href="/login">Back to user portal</a></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}