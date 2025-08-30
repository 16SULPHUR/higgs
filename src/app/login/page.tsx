'use client';

import LoginForm from '../components/auth/LoginForm';
import { redirect } from 'next/navigation';
import styles from './LoginPage.module.css';
import Link from 'next/link';
import { useSessionContext } from '@/contexts/SessionContext';
import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { getDecodedToken } from '@/lib/tokenUtils';

function LoginNotice() {
  const search = useSearchParams();
  const notice = search.get('notice');
  if (notice === 'verified') {
    return <p className={styles.linkRow}>Email verified. You can log in once an admin approves your account.</p>;
  }
  return null;
}

export default function LoginPage() {
  const session = useSessionContext();
  console.log("session", session);

  useEffect(() => {
    if (session?.session?.accessToken) {
      const decodedData = getDecodedToken(session?.session?.accessToken);
      console.log("decodedData")  
      console.log(decodedData?.type)

      if (decodedData?.type == "admin") {
        redirect('/admin/dashboard');
      }

      redirect('/dashboard');
    }
  }
    , [session]);

  // if (session) {
  //   redirect('/dashboard');
  // }

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
          {/* <div className={styles.heroContent}>
            <h2 className={styles.heroTitle}>Higgs Workspace</h2>
            <p className={styles.heroSubtitle}>Book rooms, manage events, and collaborate.</p>
          </div> */}
        </div>

        <div className={styles.formPane}>
          <div className={styles.formWrapper}>
            <Suspense fallback={null}><LoginNotice /></Suspense>
            <div className={styles.brand}>
              <Image src="/icons/higgs.png" alt="Higgs logo" width={200} height={70} className={styles.logo} />
            </div>
            <h1 className={styles.heading}>Sign in</h1>
            <p className={styles.subheading}>Welcome back.</p>
            <LoginForm variant="full" />
            <div className={styles.helperRow}>
              <div className={styles.linkRow}>New here? <Link href="/signup">Create an account</Link></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}