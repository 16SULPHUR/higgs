import { getAdminSession } from '@/lib/adminSession';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import styles from './Dashboard.module.css';
import { UserPlus, PlusCircle } from 'lucide-react';

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div>
      <header className={styles.header}>
        <div className={styles.welcomeMessage}>
          <h1 className={styles.welcomeTitle}>Admin Dashboard</h1>
          <p className={styles.welcomeText}>Welcome back, {session?.name}! Here is the platform overview.</p>
        </div>
      </header>


      <div className={styles.actionsSection}>
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
        <div className={styles.actionsGrid}>
          <Link href="/admin/dashboard/users/new" className={styles.actionCard}>
            <UserPlus size={24} className={styles.actionIcon} />
            <h3 className={styles.actionTitle}>Add New User</h3>
            <p className={styles.actionDescription}>Create a new user account and send them a welcome email.</p>
          </Link>
          <Link href="/admin/dashboard/organizations/new" className={styles.actionCard}>
            <PlusCircle size={24} className={styles.actionIcon} />
            <h3 className={styles.actionTitle}>Create Organization</h3>
            <p className={styles.actionDescription}>Set up a new organization and assign a plan.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}