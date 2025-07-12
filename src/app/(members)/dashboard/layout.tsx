import { ReactNode, Suspense } from 'react';
import Link from 'next/link';
import { BookUser, CalendarCheck, CalendarDays, Contact, User, Home, Loader2 } from 'lucide-react';
import UserProfileMenu from '@/components/common/UserProfileMenu';
import styles from './MemberLayout.module.css';

export default function MemberPortalLayout({ children }: { children: ReactNode }) {
    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <h1 className={styles.logo}>Higgs</h1>
                </div>
                <nav className={styles.nav}>
                    <Link href="/dashboard" className={styles.navLink}><Home size={18} /><span>Dashboard</span></Link>
                    <Link href="/dashboard/find-room" className={styles.navLink}><CalendarCheck size={18} /><span>Book a Space</span></Link>
                    <Link href="/dashboard/my-bookings" className={styles.navLink}><BookUser size={18} /><span>My Bookings</span></Link>
                    <Link href="/dashboard/events" className={styles.navLink}><CalendarDays size={18} /><span>Events</span></Link>
                    <Link href="/dashboard/member-book" className={styles.navLink}><Contact size={18} /><span>Member Directory</span></Link>
                </nav>
            </aside>
            <div className={styles.mainContentWrapper}>
                <header className={styles.header}>
                    <div />
                    <Suspense fallback={<Loader2 className={styles.loader}/>}>
                        <UserProfileMenu />
                    </Suspense>
                </header>
                <main className={styles.main}>
                    {children}
                </main>
            </div>
        </div>
    );
}