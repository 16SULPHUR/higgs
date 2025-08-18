'use client';

import { X, Building2, CalendarDays, ClipboardCheck, ClipboardList, DoorOpen, LayoutDashboard, LifeBuoy, MapPin, SquareStack, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './AdminMobileSidebar.module.css';

interface AdminMobileSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AdminMobileSidebar({ isOpen, onClose }: AdminMobileSidebarProps) {
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
        <>
            {isOpen && (
                <div className={styles.overlay} onClick={onClose} />
            )}
            <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
                <div className={styles.header}>
                    <h2>Admin Menu</h2>
                    <button onClick={onClose} className={styles.closeButton}>
                        <X size={24} />
                    </button>
                </div>
                
                <nav className={styles.nav}>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                                onClick={onClose}
                            >
                                <span className={styles.navIcon}>{item.icon}</span>
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </>
    );
}

