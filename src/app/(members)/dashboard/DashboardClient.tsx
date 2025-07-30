'use client';

import { redirect } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import InstallPwaButton from '@/components/common/InstallPwaButton';
import { ArrowRight, BookUser, Building, CalendarCheck, CalendarDays, Contact } from 'lucide-react';
import { getCookie } from '@/lib/cookieUtils';
import styles from './Dashboard.module.css';

export default function DashboardClient() {
  const [session, setSession] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [role, setRole] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const accessToken = getCookie("accessToken");
    setSession(accessToken);
    
    if (accessToken) {
      setUserName(getCookie("name") || "");
      setRole(getCookie("role") || "");
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
            Welcome, {userName || '...'}!
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
            <Link href="/dashboard/manage-organization" className={styles.actionCard}>
              <div className={styles.cardIconWrapper}>
                <Building size={28} className={styles.cardIcon} />
              </div>
              <div>
                <h2 className={styles.cardTitle}>Manage Org</h2>
                <p className={styles.cardDescription}>Manage organization members and settings.</p>
              </div>
              <ArrowRight size={20} className={styles.cardArrow} />
            </Link>
          )}

          <Link href="/dashboard/find-room" className={styles.actionCard}>
            <div className={styles.cardIconWrapper}>
              <CalendarCheck size={28} className={styles.cardIcon} />
            </div>
            <div>
              <h2 className={styles.cardTitle}>Book a Space</h2>
              <p className={styles.cardDescription}>Find and reserve an available meeting room or private office.</p>
            </div>
            <ArrowRight size={20} className={styles.cardArrow} />
          </Link>

          <Link href="/dashboard/my-bookings" className={styles.actionCard}>
            <div className={styles.cardIconWrapper}>
              <BookUser size={28} className={styles.cardIcon} />
            </div>
            <div>
              <h2 className={styles.cardTitle}>My Bookings</h2>
              <p className={styles.cardDescription}>View your upcoming reservations and booking history.</p>
            </div>
            <ArrowRight size={20} className={styles.cardArrow} />
          </Link>

          <Link href="/dashboard/member-book" className={styles.actionCard}>
            <div className={styles.cardIconWrapper}>
              <Contact size={28} className={styles.cardIcon} />
            </div>
            <div>
              <h2 className={styles.cardTitle}>Member Directory</h2>
              <p className={styles.cardDescription}>Connect with other members in your workspace.</p>
            </div>
            <ArrowRight size={20} className={styles.cardArrow} />
          </Link>

          <Link href="/dashboard/events" className={styles.actionCard}>
            <div className={styles.cardIconWrapper}>
              <CalendarDays size={28} className={styles.cardIcon} />
            </div>
            <div>
              <h2 className={styles.cardTitle}>Community Events</h2>
              <p className={styles.cardDescription}>View upcoming events and manage your registrations.</p>
            </div>
            <ArrowRight size={20} className={styles.cardArrow} />
          </Link>
        </div>
      </main>
    </div>
  );
}