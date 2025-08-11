'use client';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import InstallPwaButton from '@/components/common/InstallPwaButton';
import { ArrowRight, BookUser, Building, CalendarCheck, CalendarDays, Contact } from 'lucide-react';
import { clearAllCookies, getCookie } from '@/lib/cookieUtils';
import styles from './Dashboard.module.css';
import { jwtDecode } from 'jwt-decode';
import { getDecodedToken } from '@/lib/tokenUtils';
import PwaInstallPopup from '@/components/common/PwaInstallPopup';

export default function MembersDashboardPage() {
  const [session, setSession] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [role, setRole] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const accessToken = getCookie("accessToken");
    setSession(accessToken);
    const handleLoginRedirect = () => {
      clearAllCookies();
      redirect('/login');
    };
    
    if (accessToken) {
      setUserName(getCookie("name") || "");
      setRole(getCookie("role") || "");
      let isExpired = false;
      try {
        const decoded: any = jwtDecode(accessToken);
        isExpired = Date.now() > (decoded.exp * 1000);
      } catch {
        isExpired = true;
      }
      
      const decodedData = getDecodedToken(accessToken);
      if (decodedData?.type == "admin") {
        redirect('/admin/dashboard');
      }
    } else {
      handleLoginRedirect();
    }
    
    setIsClient(true);
    setIsLoading(false);
  }, []);

  if (isClient && !session) {
    redirect('/login');
  }

  const actionCards = [
    {
      href: "/dashboard/find-room",
      icon: <CalendarCheck size={28} />,
      title: "Book a Space",
      description: "Find and reserve an available meeting room or private office.",
      visible: true
    },
    {
      href: "/dashboard/my-bookings",
      icon: <BookUser size={28} />,
      title: "My Bookings",
      description: "View your upcoming reservations and booking history.",
      visible: true
    },
    {
      href: "/dashboard/member-book",
      icon: <Contact size={28} />,
      title: "Member Directory",
      description: "Connect with other members in your workspace.",
      visible: true
    },
    {
      href: "/dashboard/events",
      icon: <CalendarDays size={28} />,
      title: "Community Events",
      description: "View upcoming events and manage your registrations.",
      visible: true
    }
  ];

  if (role === 'ORG_ADMIN') {
    actionCards.unshift({
      href: "/dashboard/manage-organization",
      icon: <Building size={28} />,
      title: "Manage Org",
      description: "Manage organization members and settings.",
      visible: true
    });
  }

  return (
    <div className={styles.pageContainer}>
      <PwaInstallPopup />
      
      <header className={styles.header}>
        <div className={styles.welcomeMessage}>
          <h1 className={styles.welcomeTitle}>
            {userName && `Welcome, ${userName}!`}
          </h1>
          <p className={styles.welcomeSubtitle}>Your workspace dashboard is ready.</p>
        </div>
        <div className={styles.headerActions}>
          <InstallPwaButton />
        </div>
      </header>
      
      <main className={styles.mainContent}>
        <div className={styles.actionGrid}>
          {isLoading ? (
            Array.from({ length: role === 'ORG_ADMIN' ? 5 : 4 }).map((_, index) => (
              <div key={index} className={styles.skeletonCard}>
                <div className={styles.skeletonIcon}></div>
                <div className={styles.skeletonContent}>
                  <div className={styles.skeletonTitle}></div>
                  <div className={styles.skeletonText}></div>
                </div>
              </div>
            ))
          ) : (
            actionCards.map((card, index) => (
              card.visible && (
                <a
                  key={index}
                  href={card.href}
                  className={styles.actionCard}
                >
                  <div className={styles.cardIconWrapper}>
                    {card.icon}
                  </div>
                  <div>
                    <h2 className={styles.cardTitle}>{card.title}</h2>
                    <p className={styles.cardDescription}>{card.description}</p>
                  </div>
                  <ArrowRight size={20} className={styles.cardArrow} />
                </a>
              )
            ))
          )}
        </div>
      </main>
    </div>
  );
}