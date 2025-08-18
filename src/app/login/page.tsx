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

  // if (session) {
  //   redirect('/dashboard');
  // }

  return (
    <main className={styles.page}>
      <section className={styles.cardWrapper}>
        <Suspense fallback={null}><LoginNotice /></Suspense>
        <LoginForm />
        <div className={styles.helperRow}>
          <a className={styles.adminLink} href='/admin/login'>Admin Login</a>
          <div className={styles.linkRow}>New here? <Link href="/signup">Create an account</Link></div>
        </div>
      </section>
    </main>
  );
}