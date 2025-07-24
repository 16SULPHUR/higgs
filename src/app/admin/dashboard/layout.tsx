'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { Building2, CalendarDays, ClipboardCheck, ClipboardList, DoorOpen, LayoutDashboard, LifeBuoy, SquareStack, Users } from 'lucide-react';
import SignOutButton from '@/components/SignOutButton';
import MobileMenuButton from '@/components/MobileMenuButton';
import styles from './DashboardLayout.module.css';
import { SessionProvider } from 'next-auth/react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const closeSidebar = () => setIsSidebarOpen(false);
    

    return (
        <SessionProvider>
            <div className={styles.container}>
                {isSidebarOpen && (<div className={styles.overlay} onClick={closeSidebar} />)}
                <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
                    <div className={styles.sidebarHeader}>
                        <h1 className={styles.logo}>Higgs Admin</h1>
                    </div>
                    <nav className={styles.nav}>
                        <a href="/admin/dashboard" className={styles.navLink} onClick={closeSidebar}><LayoutDashboard size={18} /><span>Overview</span></a>
                        <a href="/admin/dashboard/bookings" className={styles.navLink} onClick={closeSidebar}><ClipboardCheck size={18} /><span>Bookings</span></a>
                        <a href="/admin/dashboard/users" className={styles.navLink} onClick={closeSidebar}><Users size={18} /><span>Users</span></a>
                        <a href="/admin/dashboard/organizations" className={styles.navLink} onClick={closeSidebar}><Building2 size={18} /><span>Organizations</span></a>
                        <a href="/admin/dashboard/plans" className={styles.navLink} onClick={closeSidebar}><ClipboardList size={18} /><span>Plans</span></a>
                        <a href="/admin/dashboard/room-types" className={styles.navLink} onClick={closeSidebar}><SquareStack size={18} /><span>Room Types</span></a>
                        <a href="/admin/dashboard/rooms" className={styles.navLink} onClick={closeSidebar}><DoorOpen size={18} /><span>Room Instances</span></a>
                        <a href="/admin/dashboard/events" className={styles.navLink} onClick={closeSidebar}><CalendarDays size={18} /><span>Events</span></a>
                        <a href="/admin/dashboard/tickets" className={styles.navLink} onClick={closeSidebar}>
                            <LifeBuoy size={18} />
                            <span>Support Tickets</span>
                        </a>
                    </nav>
                </aside>
                <div className={styles.mainContentWrapper}>
                    <header className={styles.header}>
                        <MobileMenuButton onClick={() => setIsSidebarOpen(true)} />
                        <div />
                        <SignOutButton />
                    </header>
                    <main className={styles.main}>
                        {children}
                    </main>
                </div>
            </div>
        </SessionProvider>
    );
}