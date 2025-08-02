'use client';

import LoginForm from '../components/auth/LoginForm';
import { getSession } from '../lib/session';
import { redirect } from 'next/navigation';
import styles from './LoginPage.module.css';
import Link from 'next/link';
import { useSessionContext } from '@/contexts/SessionContext';
import { useEffect } from 'react';
import { getDecodedToken } from '@/lib/tokenUtils';

export default function LoginPage() {
  const session = useSessionContext();
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
      <a href='/admin/login' >Admin Login</a>
      <LoginForm />
    </main>
  );
}