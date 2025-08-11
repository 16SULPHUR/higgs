import { BookUser, CalendarCheck, CalendarDays, Contact, Home, LifeBuoy, X } from 'lucide-react';
import styles from './MobileSidebar.module.css';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  if (!isOpen) return null;
  
  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <aside className={styles.sidebar}>
        <div className={styles.header}>
          <h1 className={styles.logo}>Higgs</h1>
          <button onClick={onClose} className={styles.closeButton} aria-label="Close menu">
            <X size={24} />
          </button>
        </div>
        <nav className={styles.nav}>
          <a href="/dashboard" className={styles.navLink} onClick={onClose}>
            <Home size={20} />
            <span>Dashboard</span>
          </a>
          <a href="/dashboard/find-room" className={styles.navLink} onClick={onClose}>
            <CalendarCheck size={20} />
            <span>Book a Space</span>
          </a>
          <a href="/dashboard/my-bookings" className={styles.navLink} onClick={onClose}>
            <BookUser size={20} />
            <span>My Bookings</span>
          </a>
          <a href="/dashboard/events" className={styles.navLink} onClick={onClose}>
            <CalendarDays size={20} />
            <span>Events</span>
          </a>
          <a href="/dashboard/member-book" className={styles.navLink} onClick={onClose}>
            <Contact size={20} />
            <span>Member Directory</span>
          </a>
          <a href="/dashboard/support" className={styles.navLink} onClick={onClose}>
            <LifeBuoy size={20} />
            <span>Support</span>
          </a>
        </nav>
      </aside>
    </>
  );
}