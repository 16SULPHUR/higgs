 
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, BookUser, CalendarCheck, CalendarDays, Contact } from 'lucide-react';
import styles from './Dashboard.module.css';
import InstallPwaButton from "@/components/common/InstallPwaButton";
import { getSession } from '@/lib/session';

export default async function MembersDashboardPage() {
  const session = await getSession();

  if (!session?.user) { redirect('/login'); }
  if (session.user.role === "SUPER_ADMIN") { redirect('/admin/dashboard'); }

  return (
    <div>
      <header className={styles.header}>
        <div className={styles.welcomeMessage}>
          <h1 className={styles.welcomeTitle}>Dashboard</h1>
          <p className={styles.welcomeSubtitle}>Welcome back, {session.user.name}! Here are your quick actions.</p>
        </div>
        <div className={styles.headerActions}>
          <InstallPwaButton />
        </div>
      </header>
      <main className={styles.mainContent}>
        <div className={styles.actionGrid}>
          <Link href="/dashboard/find-room" className={styles.actionCard}><div className={styles.cardIconWrapper}><CalendarCheck size={28} className={styles.cardIcon} /></div><div><h2 className={styles.cardTitle}>Book a Space</h2><p className={styles.cardDescription}>Find and reserve an available meeting room or private office.</p></div><ArrowRight size={20} className={styles.cardArrow} /></Link>
          <Link href="/dashboard/my-bookings" className={styles.actionCard}><div className={styles.cardIconWrapper}><BookUser size={28} className={styles.cardIcon} /></div><div><h2 className={styles.cardTitle}>My Bookings</h2><p className={styles.cardDescription}>View your upcoming reservations and booking history.</p></div><ArrowRight size={20} className={styles.cardArrow} /></Link>
          <Link href="/dashboard/member-book" className={styles.actionCard}><div className={styles.cardIconWrapper}><Contact size={28} className={styles.cardIcon} /></div><div><h2 className={styles.cardTitle}>Member Directory</h2><p className={styles.cardDescription}>Connect with other members in your workspace.</p></div><ArrowRight size={20} className={styles.cardArrow} /></Link>
          <Link href="/dashboard/events" className={styles.actionCard}><div className={styles.cardIconWrapper}><CalendarDays size={28} className={styles.cardIcon} /></div><div><h2 className={styles.cardTitle}>Community Events</h2><p className={styles.cardDescription}>View upcoming events and manage your registrations.</p></div><ArrowRight size={20} className={styles.cardArrow} /></Link>
        </div>
      </main>
    </div>
  );
}