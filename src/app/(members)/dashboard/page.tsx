import { getSession } from '../../lib/session';

import { redirect } from 'next/navigation';
import styles from './Dashboard.module.css';
import Link from 'next/link';

export default async function MembersDashboardPage() {
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

        <Link href="/dashboard/find-room">Book a Meeting</Link>
      </main>
    </div>
  );
}