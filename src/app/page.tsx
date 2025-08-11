'use client';

import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import styles from './HomePage.module.css';
import { clearAllCookies, getCookie } from './lib/cookieUtils';
import SignOutButton from './components/SignOutButton';
import InstallPwaButton from './components/common/InstallPwaButton';
import { InstallPrompt } from './components/common/InstallPrompt'; 

export default function HomePage() {
  useEffect(() => {
    const session = getCookie("accessToken");
    const role = getCookie("role") || "";

    if (!session) {
      redirect('/login');
      return;
    }

    const rolePrefix = role.split("_")[0];
    if (rolePrefix === "ORG") {
      redirect('/dashboard');
    } else if (rolePrefix === "SUPER") {
      redirect("/admin/dashboard");
    } else {
      clearAllCookies();
      redirect("/login");
    }
  }, []);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.topRightActions}>
        <InstallPwaButton />
        <SignOutButton />
      </div>
      <InstallPrompt />
      

      <div className={styles.contentWrapper}>
        <Image
          src="/logo.png"
          alt="logo"
          width={1500}
          height={500}
          className="logoImage"
        />
        <div className={styles.navLinks}>
          <a href="/login" className={styles.navButton}>
            Go to Login
          </a >
          <a href="/dashboard" className={styles.navButton}>
            Go to Dashboard
          </a >
        </div>
      </div>
    </div>
  );
}