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
import { clearAllCookies, getCookie } from './lib/cookieUtils';

export default function HomePage() {

  const session = getCookie("accessToken");
  const role = getCookie("role") || "";
  console.log("session")
  console.log(session)

  useEffect(() => {
    if (!session) {
      redirect('/login');
    }
    if (role.split("_")[0] == "ORG") {
      redirect('/dashboard');
    }
    else if (role.split("_")[0] == "SUPER") {
      redirect("/admin/dashboard")
    }
    else {
      clearAllCookies();
      redirect("/login")
    }
  }, [session])


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