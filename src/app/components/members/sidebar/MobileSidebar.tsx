"use client";

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { BookUser, CalendarCheck, CalendarDays, Contact, Home, LifeBuoy, X } from 'lucide-react';
import styles from './MobileSidebar.module.css';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname();
  if (!isOpen) return null;

  const navItems = [
    { href: '/dashboard', icon: <Home size={18} />, label: 'Dashboard' },
    { href: '/dashboard/find-room', icon: <CalendarCheck size={18} />, label: 'Book a Space' },
    { href: '/dashboard/my-bookings', icon: <BookUser size={18} />, label: 'My Bookings' },
    { href: '/dashboard/events', icon: <CalendarDays size={18} />, label: 'Events' },
    { href: '/dashboard/member-book', icon: <Contact size={18} />, label: 'Member Directory' },
    { href: '/dashboard/support', icon: <LifeBuoy size={18} />, label: 'Support' },
  ];

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <aside className={styles.sidebar}>
        <div className={styles.header}>
          <a href="/dashboard" className={styles.logoContainer} onClick={onClose}>
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
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${pathname === item.href ? styles.activeNavLink : ''}`}
              onClick={onClose}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </aside>
    </>
  );
}