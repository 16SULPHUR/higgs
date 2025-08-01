'use client';

import { ReactNode, useState, useEffect } from 'react';
import { BookUser, CalendarCheck, CalendarDays, Contact, Home, LifeBuoy } from 'lucide-react';
import styles from './MemberLayout.module.css';
import MobileSidebar from '@/components/members/sidebar/MobileSidebar';
import MobileMenuButton from '@/components/members/sidebar/MobileMenuButton';
import UserProfileMenu from '@/components/common/UserProfileMenu';
import { getCookie } from '@/lib/cookieUtils';
import Image from 'next/image';

export default function MemberPortalLayout({ children }: { children: ReactNode }) {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [isOrgUser, setIsOrgUser] = useState(true);

  useEffect(() => {
    const role = getCookie("role");
    setIsOrgUser(role === "ORG_USER");
  }, []);

  return (
    <div className={styles.container}>
      <aside className={styles.desktopSidebar}>
        <div className={styles.sidebarHeader}>
          {/* <h1 className={styles.logo}>Higgs</h1> */}
          <Image
            src="/logo.png"
            alt="logo"
            width={150}
            height={50}
            className={styles.logo}
          />
        </div>
        <nav className={styles.nav}>
          <a href="/dashboard" className={styles.navLink}><Home size={18} /><span>Dashboard</span></a>

          <>
            <a href="/dashboard/find-room" className={styles.navLink}><CalendarCheck size={18} /><span>Book a Space</span></a>
            <a href="/dashboard/my-bookings" className={styles.navLink}><BookUser size={18} /><span>My Bookings</span></a>
          </>

          <a href="/dashboard/events" className={styles.navLink}><CalendarDays size={18} /><span>Events</span></a>
          <a href="/dashboard/member-book" className={styles.navLink}><Contact size={18} /><span>Member Directory</span></a>
          <a href="/dashboard/support" className={styles.navLink}><LifeBuoy size={18} /><span>Support</span></a>
        </nav>
      </aside>

      <MobileSidebar isOpen={isMobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

      <div className={styles.mainContentWrapper}>
        <header className={styles.header}>
          <MobileMenuButton onClick={() => setMobileSidebarOpen(true)} />
          <div />
          <UserProfileMenu />
        </header>
        <main className={styles.main}>
          {children}
        </main>
      </div>
    </div>
  );
}