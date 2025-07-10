import { getSession } from '@/lib/session'; // Assuming this is your corrected user session helper
import { redirect } from 'next/navigation';
import Link from 'next/link';
import SignOutButton from '@/components/SignOutButton';
import InstallPwaButton from '@/components/common/InstallPwaButton';
import { ArrowRight, BookUser, CalendarCheck } from 'lucide-react';
import styles from './Dashboard.module.css';

// The InstallPrompt component is likely a non-visual logic component,
// so it's fine to keep it if it's part of your PWA setup. We'll hide it with CSS if needed.
import { InstallPrompt } from '@/components/common/InstallPrompt';
import InstallPwaPrompt from '@/components/common/InstallPwaPrompt';

export default async function MembersDashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  if (session?.user?.role === "SUPER_ADMIN") {
    redirect('/admin/dashboard');
  }

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <div className={styles.headerActions}>
          <InstallPwaPrompt />
          <SignOutButton />
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.actionGrid}>
          {/* Action Card for Booking */}
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

          {/* Action Card for My Bookings */}
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
        </div>

        {/* You can add more sections here later, like "Upcoming Events" */}
      </main>
    </div>
  );
}