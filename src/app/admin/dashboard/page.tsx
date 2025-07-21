
import { redirect } from 'next/navigation';
import Link from 'next/link';
import styles from './Dashboard.module.css';
import { UserPlus, PlusCircle } from 'lucide-react';
import { getSession } from '@/lib/session';

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div>
      <header className={styles.header}>
        <div className={styles.welcomeMessage}>
          <h1 className={styles.welcomeTitle}>Admin Dashboard</h1>
          <p className={styles.welcomeText}>Welcome back, {session?.user?.name}! Here is the platform overview.</p>
        </div>
      </header>


      <div className={styles.actionsSection}>
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
        <div className={styles.actionsGrid}>
          <a href="/admin/dashboard/users/new" className={styles.actionCard}>
            <UserPlus size={24} className={styles.actionIcon} />
            <h3 className={styles.actionTitle}>Add New User</h3>
            <p className={styles.actionDescription}>Create a new user account and send them a welcome email.</p>
          </a>
          <a href="/admin/dashboard/organizations/new" className={styles.actionCard}>
            <PlusCircle size={24} className={styles.actionIcon} />
            <h3 className={styles.actionTitle}>Create Organization</h3>
            <p className={styles.actionDescription}>Set up a new organization and assign a plan.</p>
          </a>
        </div>
      </div>
    </div>
  );
}