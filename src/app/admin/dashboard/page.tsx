import { getSession } from '../../lib/session';
import SignOutButton from '../../components/SignOutButton';
import { redirect } from 'next/navigation';
import styles from './Dashboard.module.css';
import { Users, BarChart, BookOpenCheck } from 'lucide-react';

export default async function DashboardPage() {
  const session = await getSession();
  console.log(session)
  if (!session) {

    redirect('/login');
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.welcomeCard}>
          <h2 className={styles.welcomeTitle}>Welcome back, {session?.user?.name}!</h2>
        </div>

      </main>
    </div>
  );
}