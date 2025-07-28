'use client';

import LoginForm from '../components/auth/LoginForm';
import { getSession } from '../lib/session';
import { redirect } from 'next/navigation';
import styles from './LoginPage.module.css';
import Link from 'next/link';
import { useSessionContext } from '@/contexts/SessionContext';
import { useEffect } from 'react';

export default function LoginPage() {
  const session = useSessionContext();
  console.log("session", session);

  useEffect(() => {
    if (session) {
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