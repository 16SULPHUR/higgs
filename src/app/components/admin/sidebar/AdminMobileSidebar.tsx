'use client';

import { X, Building2, CalendarDays, ClipboardCheck, ClipboardList, DoorOpen, LayoutDashboard, LifeBuoy, MapPin, SquareStack, Users, Shield } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './AdminMobileSidebar.module.css';
import Image from 'next/image';
import { getDecodedToken } from '@/lib/tokenUtils';
import { useSessionContext } from '@/contexts/SessionContext';

interface AdminMobileSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AdminMobileSidebar({ isOpen, onClose }: AdminMobileSidebarProps) {
    const session = useSessionContext();
    const pathname = usePathname();
    if (!isOpen) return null;

    const isSuperAdmin = getDecodedToken(session?.session?.accessToken)?.role === 'SUPER_ADMIN';

    const navItems = [
        { href: '/admin/dashboard', icon: <LayoutDashboard size={18} />, label: 'Overview' },
        { href: '/admin/dashboard/bookings', icon: <ClipboardCheck size={18} />, label: 'Bookings' },
        { href: '/admin/dashboard/users', icon: <Users size={18} />, label: 'Users' },
        { href: '/admin/dashboard/organizations', icon: <Building2 size={18} />, label: 'Organizations' },
        ...(isSuperAdmin
            ? [
                { href: '/admin/dashboard/super-admins', icon: <Shield size={18} />, label: 'Super Admins' },
                { href: '/admin/dashboard/location-admins', icon: <MapPin size={18} />, label: 'Location Admins' }
            ]
            : []),
        { href: '/admin/dashboard/plans', icon: <ClipboardList size={18} />, label: 'Plans' },
        { href: '/admin/dashboard/room-types', icon: <SquareStack size={18} />, label: 'Room Types' },
        { href: '/admin/dashboard/rooms', icon: <DoorOpen size={18} />, label: 'Room Instances' },
        { href: '/admin/dashboard/events', icon: <CalendarDays size={18} />, label: 'Events' },
        { href: '/admin/dashboard/tickets', icon: <LifeBuoy size={18} />, label: 'Support Tickets' },
    ];

    return (
        <>
            <div className={styles.overlay} onClick={onClose} />
            <aside className={styles.sidebar}>
                <div className={styles.header}>
                    <a href="/admin/dashboard" className={styles.logoContainer} onClick={onClose}>
                        <Image
                            src="/logo.png"
                            alt="Higgs"
                            fill
                            className={styles.logo}
                            sizes="(max-width: 100px) 1rem, 150px"
                        />
                    </a>
                    <button onClick={onClose} className={styles.closeButton} aria-label="Close menu">
                        <X size={20} />
                    </button>
                </div>

                <nav className={styles.nav}>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`${styles.navLink} ${isActive ? styles.activeNavLink : ''}`}
                                onClick={onClose}
                            >
                                <span className={styles.navIcon}>{item.icon}</span>
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}

