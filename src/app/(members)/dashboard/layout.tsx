'use client';
import { ReactNode, useState, useEffect } from 'react';
import { BookUser, CalendarCheck, CalendarDays, Contact, Home, LifeBuoy, Settings, Bell, Search } from 'lucide-react';
import styles from './MemberLayout.module.css';
import MobileSidebar from '@/components/members/sidebar/MobileSidebar';
import MobileMenuButton from '@/components/members/sidebar/MobileMenuButton';
import UserProfileMenu from '@/components/common/UserProfileMenu';
import { getCookie } from '@/lib/cookieUtils';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function MemberPortalLayout({ children }: { children: ReactNode }) {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isOrgUser, setIsOrgUser] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(3);
  const pathname = usePathname();

  useEffect(() => {
    const role = getCookie("role");
    setIsOrgUser(role === "ORG_USER");
  }, []);

  const navItems = [
    { href: "/dashboard", icon: <Home size={18} />, label: "Dashboard" },
    { href: "/dashboard/find-room", icon: <CalendarCheck size={18} />, label: "Book a Space" },
    { href: "/dashboard/my-bookings", icon: <BookUser size={18} />, label: "My Bookings" },
    { href: "/dashboard/events", icon: <CalendarDays size={18} />, label: "Events" },
    { href: "/dashboard/member-book", icon: <Contact size={18} />, label: "Member Directory" },
    { href: "/dashboard/support", icon: <LifeBuoy size={18} />, label: "Support" },
    { href: "/dashboard/settings", icon: <Settings size={18} />, label: "Settings" },
  ];

  return (
    <div className={styles.container}>
      <aside className={styles.desktopSidebar}>
        <div className={styles.sidebarHeader}>
          <a href="/dashboard" className={styles.logoContainer}>
            <Image
              src="/logo.png"
              className={styles.logo}
              alt="logo"
              fill
              sizes="(max-width: 100px) 1rem, 150px"
            />
          </a>
        </div>
         
        
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${pathname === item.href ? styles.activeNavLink : ''}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </aside>
      
      <MobileSidebar isOpen={isMobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
      
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
        
        <nav className={styles.mobileBottomNav}>
          {navItems.slice(0, 5).map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`${styles.mobileNavItem} ${pathname === item.href ? styles.activeMobileNavItem : ''}`}
            >
              {item.icon}
              <span className={styles.mobileNavLabel}>{item.label}</span>
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}