import Link from 'next/link';
import styles from './HomePage.module.css';
import MembersDashboardPage from './(members)/dashboard/page';


export default function HomePage() {
  return (
    <div className={styles.pageContainer}>
      {/* <Link href='/admin/dashboard' >Dashboard</Link> */}
      <MembersDashboardPage />
    </div>
  );
}