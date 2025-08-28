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
import { getAuthCookies } from './lib/auth.cookies';

export default function HomePage() {
  useEffect(() => {
    const session = getCookie("accessToken");
    const isAdmin = getCookie('role')?.toString().split('_')[1] == 'ADMIN';

    if (!session) {
      redirect('/login');
      return;
    }

    if (!isAdmin) {
      redirect('/dashboard');
    } 
    
    if (isAdmin) {
      redirect("/admin/dashboard");
    }
    
    else {
      clearAllCookies();
      redirect("/login");
    }
  }, []);

  return (
    <div className={styles.pageContainer}>
      {/* <div className={styles.topRightActions}>
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
      </div> */}
    </div>
  );
}