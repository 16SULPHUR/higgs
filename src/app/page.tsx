import Link from 'next/link';
import styles from './HomePage.module.css';
import MembersDashboardPage from './(members)/dashboard/page';
import SignOutButton from './components/SignOutButton';

export default function HomePage() {

  return (
    <div className={styles.pageContainer}>
      {/* <Link href='/admin/dashboard'>Admin Dashboard</Link> */}
      <SignOutButton />
      <MembersDashboardPage />
    </div>
  );
}
