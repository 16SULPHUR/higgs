import Link from 'next/link';
import styles from './HomePage.module.css';
import MembersDashboardPage from './(members)/dashboard/page';
import SignOutButton from './components/SignOutButton';
// import { useEffect, useState } from 'react';
import InstallPwaButton from './components/common/InstallPwaButton';
import { InstallPrompt } from './components/common/InstallPrompt';
import { getSession } from './lib/session';
import { redirect } from 'next/navigation';

export default async function HomePage() {

  const session = await getSession();
  console.log(session)
  if (!session) {
    redirect('/login');
  }
  if (session?.user?.role === "SUPER_ADMIN") {
    redirect('/admin/dashboard');
  } else {
    redirect('/dashboard')
  }

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