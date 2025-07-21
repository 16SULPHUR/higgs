
import { redirect } from 'next/navigation';
import Link from 'next/link';
import SignOutButton from '@/components/SignOutButton';
import InstallPwaButton from '@/components/common/InstallPwaButton';
import { ArrowRight, BookUser, Building, CalendarCheck, CalendarDays, Contact } from 'lucide-react'; // Added Building icon
import styles from './Dashboard.module.css';
import { getSession } from '@/lib/session';

export default async function MembersDashboardPage() {
  const session = await getSession();

  if (!session?.user) { 
    redirect('/login'); 
  }
  // This redirect is good practice if a Super Admin logs into the user portal
  if (session.user.role === "SUPER_ADMIN") { 
    redirect('/admin/dashboard'); 
  }

  // Determine if the user is an Organization Admin
  const isOrgAdmin = session.user.role === 'ORG_ADMIN';

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <div className={styles.welcomeMessage}>
          <h1 className={styles.welcomeTitle}>Welcome, {session.user.name}!</h1>
          <p className={styles.welcomeSubtitle}>Your workspace dashboard is ready.</p>
        </div>
        <div className={styles.headerActions}>
          <InstallPwaButton />
          {/* We can move the SignOutButton to the UserProfileMenu in the layout */}
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.actionGrid}>
          {/* --- THIS IS THE NEW CONDITIONAL CARD --- */}
          {isOrgAdmin && (
            <a href="/dashboard/manage-organization" className={styles.actionCard}>
              <div className={styles.cardIconWrapper}>
                <Building size={28} className={styles.cardIcon} />
              </div>
              <div>
                <h2 className={styles.cardTitle}>Manage Organization</h2>
                <p className={styles.cardDescription}>Update your organization's profile, logo, and details.</p>
              </div>
              <ArrowRight size={20} className={styles.cardArrow} />
            </a>
          )}

          {/* Existing Action Cards */}
          <a href="/dashboard/find-room" className={styles.actionCard}><div className={styles.cardIconWrapper}><CalendarCheck size={28} className={styles.cardIcon} /></div><div><h2 className={styles.cardTitle}>Book a Space</h2><p className={styles.cardDescription}>Find and reserve an available meeting room or private office.</p></div><ArrowRight size={20} className={styles.cardArrow} /></a>
          <a href="/dashboard/my-bookings" className={styles.actionCard}><div className={styles.cardIconWrapper}><BookUser size={28} className={styles.cardIcon} /></div><div><h2 className={styles.cardTitle}>My Bookings</h2><p className={styles.cardDescription}>View your upcoming reservations and booking history.</p></div><ArrowRight size={20} className={styles.cardArrow} /></a>
          <a href="/dashboard/member-book" className={styles.actionCard}><div className={styles.cardIconWrapper}><Contact size={28} className={styles.cardIcon} /></div><div><h2 className={styles.cardTitle}>Member Directory</h2><p className={styles.cardDescription}>Connect with other members in your workspace.</p></div><ArrowRight size={20} className={styles.cardArrow} /></a>
          <a href="/dashboard/events" className={styles.actionCard}><div className={styles.cardIconWrapper}><CalendarDays size={28} className={styles.cardIcon} /></div><div><h2 className={styles.cardTitle}>Community Events</h2><p className={styles.cardDescription}>View upcoming events and manage your registrations.</p></div><ArrowRight size={20} className={styles.cardArrow} /></a>
        </div>
      </main>
    </div>
  );
}