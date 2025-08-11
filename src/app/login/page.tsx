'use client';

import LoginForm from '../components/auth/LoginForm';
import { getSession } from '../lib/session';
import { redirect } from 'next/navigation';
import styles from './LoginPage.module.css';
import Link from 'next/link';
import { useSessionContext } from '@/contexts/SessionContext';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getDecodedToken } from '@/lib/tokenUtils';

export default function LoginPage() {
  const session = useSessionContext();
  const search = useSearchParams();
  const notice = search.get('notice');
  console.log("session", session);

  useEffect(() => {
    if (session) {
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
    <main className={styles.container}>
      <div className={styles.stack}>
        {notice === 'verified' && (
          <p className={styles.linkRow}>Email verified. You can log in once an admin approves your account.</p>
        )}
        <a className={styles.adminLink} href='/admin/login'>Admin Login</a>
        <p className={styles.linkRow}>
          New here? <Link href="/signup">Create an account</Link>
        </p>
        <LoginForm />
      </div>
    </main>
  );
}