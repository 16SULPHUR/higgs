'use client';

import Link from 'next/link';
import styles from './HomePage.module.css';
import MembersDashboardPage from './(members)/dashboard/page';
import SignOutButton from './components/SignOutButton';
// import { useEffect, useState } from 'react';
import InstallPwaButton from './components/common/InstallPwaButton';
import { InstallPrompt } from './components/common/InstallPrompt';
import { getSession } from './lib/session';
import { redirect } from 'next/navigation';
import { useSessionContext } from './contexts/SessionContext';
import { useEffect } from 'react';

export default function HomePage() {

  const session = useSessionContext();
  console.log("session")
  console.log(session)

  useEffect(() => {
    if (!session) {
      redirect('/login');
    }
  }, [session])

  // if (session) {
  //   redirect('/dashboard');
  // } 
  // else {
  //   redirect('/dashboard')
  // }

  return (
    <div className={styles.pageContainer}>
      <SignOutButton />
      <InstallPrompt />
      <div className={styles.headerActions}>
        <InstallPwaButton />
      </div>
      <MembersDashboardPage />
    </div>
  );
}