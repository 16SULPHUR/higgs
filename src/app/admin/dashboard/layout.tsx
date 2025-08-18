'use client';

import { ReactNode, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Building2, CalendarDays, ClipboardCheck, ClipboardList, DoorOpen, LayoutDashboard, LifeBuoy, MapPin, SquareStack, Users } from 'lucide-react';
import SignOutButton from '@/components/SignOutButton';
import MobileMenuButton from '@/components/MobileMenuButton';
import AdminMobileSidebar from '@/components/admin/sidebar/AdminMobileSidebar';
import UserProfileMenu from '@/components/common/UserProfileMenu';
import styles from './DashboardLayout.module.css'; 
import { SessionProvider } from '@/contexts/SessionContext';
import Image from 'next/image';

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const pathname = usePathname();

    const navItems = [
        { href: '/admin/dashboard', icon: <LayoutDashboard size={18} />, label: 'Overview' },
        { href: '/admin/dashboard/bookings', icon: <ClipboardCheck size={18} />, label: 'Bookings' },
        { href: '/admin/dashboard/users', icon: <Users size={18} />, label: 'Users' },
        { href: '/admin/dashboard/organizations', icon: <Building2 size={18} />, label: 'Organizations' },
        { href: '/admin/dashboard/location-admins', icon: <MapPin size={18} />, label: 'Location Admins' },
        { href: '/admin/dashboard/plans', icon: <ClipboardList size={18} />, label: 'Plans' },
        { href: '/admin/dashboard/room-types', icon: <SquareStack size={18} />, label: 'Room Types' },
        { href: '/admin/dashboard/rooms', icon: <DoorOpen size={18} />, label: 'Room Instances' },
        { href: '/admin/dashboard/events', icon: <CalendarDays size={18} />, label: 'Events' },
        { href: '/admin/dashboard/tickets', icon: <LifeBuoy size={18} />, label: 'Support Tickets' },
    ];

    return (
        <SessionProvider>
            <div className={styles.container}>
                <aside className={styles.desktopSidebar}>
                    <div className={styles.sidebarHeader}>
                        <a href="/admin/dashboard" className={styles.logoContainer}>
                            <Image
                                src="/logo.png"
                                className={styles.logo}
                                alt="Higgs Admin"
                                fill
                                sizes="(max-width: 100px) 1rem, 150px"
                            />
                        </a>
                    </div>
                    
                    <nav className={styles.nav}>
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <a
                                    key={item.href}
                                    href={isActive ? undefined : item.href}
                                    aria-disabled={isActive}
                                    className={`${styles.navLink} ${isActive ? styles.activeNavLink : ''}`}
                                    onClick={(e) => {
                                        if (isActive) e.preventDefault();
                                    }}
                                >
                                    <span className={styles.navIcon}>{item.icon}</span>
                                    <span>{item.label}</span>
                                </a>
                            );
                        })}
                    </nav>
                </aside>
                
                <AdminMobileSidebar isOpen={isMobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
                
                <div className={styles.mainContentWrapper}>
                    <header className={styles.header}>
                        <div className={styles.headerLeft}>
                            <MobileMenuButton onClick={() => setMobileSidebarOpen(true)} />
                        </div>
                        
                        <div className={styles.headerActions}>
                            <UserProfileMenu />
                        </div>
                    </header>
                    
                    <main className={styles.main}>
                        {children}
                    </main>
                </div>
            </div>
        </SessionProvider>
    );
}