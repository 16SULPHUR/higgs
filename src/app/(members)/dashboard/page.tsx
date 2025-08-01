'use client';

import { redirect } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import InstallPwaButton from '@/components/common/InstallPwaButton';
import { ArrowRight, BookUser, Building, CalendarCheck, CalendarDays, Contact } from 'lucide-react';
import { clearAllCookies, getCookie } from '@/lib/cookieUtils';
import styles from './Dashboard.module.css';
import { jwtDecode } from 'jwt-decode'; 

export default function MembersDashboardPage() {
  const [session, setSession] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [role, setRole] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const accessToken = getCookie("accessToken"); 
    setSession(accessToken);

    const handleLoginRedirect = () => {
      clearAllCookies();
      redirect('/login');
    };

    if (accessToken) {
      setUserName(getCookie("name") || "");
      setRole(getCookie("role") || "");

      let isExpired = false;
      try {
        const decoded: any = jwtDecode(accessToken);
        isExpired = Date.now() > (decoded.exp * 1000);
      } catch {
        isExpired = true;
      }

       
    } else {
      handleLoginRedirect();
    }
    setIsClient(true);
  }, []);

  if (isClient && !session) {
    redirect('/login');
  }

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <div className={styles.welcomeMessage}>
          <h1 className={styles.welcomeTitle}>
            {userName && `Welcome, ${userName}!`}
          </h1>
          <p className={styles.welcomeSubtitle}>Your workspace dashboard is ready.</p>
        </div>
        <div className={styles.headerActions}>
          <InstallPwaButton />
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.actionGrid}>
          {role === 'ORG_ADMIN' && (
            <a href="/dashboard/manage-organization" className={styles.actionCard}>
              <div className={styles.cardIconWrapper}>
                <Building size={28} className={styles.cardIcon} />
              </div>
              <div>
                <h2 className={styles.cardTitle}>Manage Org</h2>
                <p className={styles.cardDescription}>Manage organization members and settings.</p>
              </div>
              <ArrowRight size={20} className={styles.cardArrow} />
            </a>
          )}
          <a href="/dashboard/find-room" className={styles.actionCard}>
            <div className={styles.cardIconWrapper}>
              <CalendarCheck size={28} className={styles.cardIcon} />
            </div>
            <div>
              <h2 className={styles.cardTitle}>Book a Space</h2>
              <p className={styles.cardDescription}>Find and reserve an available meeting room or private office.</p>
            </div>
            <ArrowRight size={20} className={styles.cardArrow} />
          </a>
          <a href="/dashboard/my-bookings" className={styles.actionCard}>
            <div className={styles.cardIconWrapper}>
              <BookUser size={28} className={styles.cardIcon} />
            </div>
            <div>
              <h2 className={styles.cardTitle}>My Bookings</h2>
              <p className={styles.cardDescription}>View your upcoming reservations and booking history.</p>
            </div>
            <ArrowRight size={20} className={styles.cardArrow} />
          </a>

          <a href="/dashboard/member-book" className={styles.actionCard}>
            <div className={styles.cardIconWrapper}>
              <Contact size={28} className={styles.cardIcon} />
            </div>
            <div>
              <h2 className={styles.cardTitle}>Member Directory</h2>
              <p className={styles.cardDescription}>Connect with other members in your workspace.</p>
            </div>
            <ArrowRight size={20} className={styles.cardArrow} />
          </a>

          <a href="/dashboard/events" className={styles.actionCard}>
            <div className={styles.cardIconWrapper}>
              <CalendarDays size={28} className={styles.cardIcon} />
            </div>
            <div>
              <h2 className={styles.cardTitle}>Community Events</h2>
              <p className={styles.cardDescription}>View upcoming events and manage your registrations.</p>
            </div>
            <ArrowRight size={20} className={styles.cardArrow} />
          </a>
        </div>
      </main>
    </div>
  );
}