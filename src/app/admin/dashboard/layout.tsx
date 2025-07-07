'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { Building2, CalendarDays, ClipboardList, DoorOpen, LayoutDashboard } from 'lucide-react';
import SignOutButton from '@/components/SignOutButton';
import MobileMenuButton from '@/components/MobileMenuButton'; 

import styles from './DashboardLayout.module.css';

export default function DashboardLayout({ children }: { children: ReactNode }) {
   
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    

    return (
        <div className={styles.container}>
            
            {isSidebarOpen && (
                <div 
                    className={styles.overlay}
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
                <div className={styles.sidebarHeader}>
                    <h1 className={styles.logo}>Higgs</h1>
                </div>
                <nav className={styles.nav}>
                    <Link href="/admin/dashboard" className={styles.navLink} onClick={() => setIsSidebarOpen(false)}>
                        <LayoutDashboard size={18} />
                        <span>Overview</span>
                    </Link>
                    <Link href="/admin/dashboard/rooms" className={styles.navLink} onClick={() => setIsSidebarOpen(false)}>
                        <DoorOpen size={18} />
                        <span>Meeting Rooms</span>
                    </Link>
                    <Link href="/admin/dashboard/organizations" className={styles.navLink} onClick={() => setIsSidebarOpen(false)}>
                        <Building2 size={18} />
                        <span>Organizations</span>
                    </Link>
                    <Link href="/admin/dashboard/plans" className={styles.navLink} onClick={() => setIsSidebarOpen(false)}>
                        <ClipboardList size={18} />
                        <span>Plans</span>
                    </Link>
                    <Link href="/admin/dashboard/events" className={styles.navLink} onClick={() => setIsSidebarOpen(false)}>
                        <CalendarDays size={18} />
                        <span>Events</span>
                    </Link>
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
    );
}