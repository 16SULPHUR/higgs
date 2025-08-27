'use client';

import { useEffect, useMemo, useState } from 'react';
import { redirect } from 'next/navigation';

import styles from './Dashboard.module.css';
import InstallPwaButton from '@/components/common/InstallPwaButton';
import PwaInstallPopup from '@/components/common/PwaInstallPopup';

import { api } from '@/lib/api.client';
import { getCookie } from '@/lib/cookieUtils';
import { getDecodedToken } from '@/lib/tokenUtils';
import { useSessionContext } from '@/contexts/SessionContext';

import { ArrowRight, BookUser, Building, CalendarCheck, CalendarDays, Contact, LifeBuoy, Wallet, Plus } from 'lucide-react';

export default function MembersDashboardPage() {
  const session = useSessionContext();

  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [userData, setUserData] = useState<any | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
 
  useEffect(() => {
    setMounted(true); 
    if (session === undefined) return;
    const accessToken = getCookie('accessToken');
    if (session === null || !accessToken) {
      redirect('/login');
      return;
    }
    if (accessToken) {
      const decoded = getDecodedToken(accessToken);
      if ((decoded as any)?.type === 'admin') {
        redirect('/admin/dashboard');
      }
    }
  }, [session]);

  useEffect(() => {
    const load = async () => {
      if (!session) return; // wait until session is available
      try {
        setIsLoading(true);
        setError(null);
        const [me, b, e, t] = await Promise.all([
          api.get(session, '/api/auth/me'),
          api.get(session, '/api/bookings'),
          api.get(session, '/api/events'),
          api.get(session, '/api/support-tickets'),
        ]);
        setUserData(me);
        setBookings(Array.isArray(b) ? b : []);
        setEvents(Array.isArray(e) ? e : []);
        setTickets(Array.isArray(t) ? t : []);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    if (session !== undefined) {
      load();
    }
  }, [session]);

  const userName = mounted ? (userData?.name || getCookie('name') || '') : '';
  const role: string = mounted ? (userData?.role || getCookie('role') || '') : (userData?.role || '');

  const availableCredits = useMemo(() => {
    if (!userData) return 0;
    if (userData.role === 'INDIVIDUAL_USER') return userData.individual_credits || 0;
    return userData.organization_credits_pool || 0;
  }, [userData]);

  const now = new Date();
  const upcomingBookings = useMemo(() => {
    return bookings
      .filter(b => b.status === 'CONFIRMED' && new Date(b.start_time) > now)
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
      .slice(0, 3);
  }, [bookings]);

  const upcomingEvents = useMemo(() => {
    return events
      .filter((ev: any) => ev.date && new Date(ev.date) >= now)
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);
  }, [events]);

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const formatTime = (d: string) => new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const actionCards = [
    {
      href: '/dashboard/find-room',
      icon: <CalendarCheck size={28} />,
      title: 'Book a Space',
      description: 'Find and reserve an available meeting room or private office.',
      visible: true,
    },
    {
      href: '/dashboard/my-bookings',
      icon: <BookUser size={28} />,
      title: 'My Bookings',
      description: 'View your upcoming reservations and booking history.',
      visible: true,
    },
    {
      href: '/dashboard/member-book',
      icon: <Contact size={28} />,
      title: 'Member Directory',
      description: 'Connect with other members in your workspace.',
      visible: true,
    },
    {
      href: '/dashboard/events',
      icon: <CalendarDays size={28} />,
      title: 'Community Events',
      description: 'View upcoming events and manage your registrations.',
      visible: true,
    },
  ];

  if (role === 'ORG_ADMIN') {
    actionCards.unshift({
      href: '/dashboard/manage-organization',
      icon: <Building size={28} />,
      title: 'Manage Org',
      description: 'Manage organization members and settings.',
      visible: true,
    });
  }

  const overviewCards = [
    // { label: 'Available Credits', value: availableCredits, icon: <Wallet size={20} /> },
    // { label: 'Upcoming Bookings', value: upcomingBookings.length, icon: <CalendarCheck size={20} />, href: '/dashboard/my-bookings' },
    { label: 'Tickets', value: tickets.length, icon: <LifeBuoy size={20} />, href: '/dashboard/support' },
    { label: 'Upcoming Events', value: upcomingEvents.length, icon: <CalendarDays size={20} />, href: '/dashboard/events' },
    // { label: 'Book a Space', value: 'Quick', icon: <Plus size={20} />, href: '/dashboard/find-room' },
  ];

  return (
    <div className={styles.pageContainer}>
      <PwaInstallPopup />

      <header className={styles.header} suppressHydrationWarning>
        <div className={styles.welcomeMessage}>
          <h1 className={styles.welcomeTitle}>{userName ? `Welcome, ${userName}!` : 'Welcome!'}</h1>
          <p className={styles.welcomeSubtitle}>Your workspace dashboard is ready.</p>
        </div>
        <div className={styles.headerActions}>
          <InstallPwaButton />
        </div>
      </header>

      <main className={styles.mainContent}>
        {/* Overview */}
        <div className={styles.overviewGrid}>
          {(isLoading ? Array.from({ length: 4 }) : overviewCards).map((card: any, idx: number) => (
            isLoading ? (
              <div key={idx} className={styles.overviewCard}>
                <div className={styles.overviewSkeleton} />
              </div>
            ) : (
              <a key={idx} href={card.href} className={styles.overviewCard}>
                <div className={styles.overviewIcon}>{card.icon}</div>
                <div className={styles.overviewLabel}>{card.label}</div>
                <div className={styles.overviewValue}>{card.value}</div>
                {/* <div className={styles.overviewAction}>
                  <ArrowRight size={16} />  
                </div> */}
              </a>
            )
          ))}
        </div>

        {/* Key sections */}
        <div className={styles.sectionsGrid}>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Upcoming bookings</h2>
              <a className={styles.sectionAction} href="/dashboard/my-bookings">View all</a>
            </div>
            {isLoading ? (
              <div className={styles.skeletonList} />
            ) : upcomingBookings.length > 0 ? (
              <ul className={styles.simpleList}>
                {upcomingBookings.map(b => (
                  <li key={b.id}>
                    <a href={`/dashboard/my-bookings`} className={styles.simpleListItem}>
                      <div>
                        <div className={styles.simpleListPrimary}>{b.room_type_name} • {formatDate(b.start_time)}</div>
                        <div className={styles.simpleListSecondary}>{formatTime(b.start_time)} – {formatTime(b.end_time)}</div>
                      </div>
                      <div className={styles.simpleListAction}>
                        <ArrowRight size={14} />
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <div className={styles.emptyStateBox}>
                <p>You have no upcoming bookings.</p>
                <a href="/dashboard/find-room" className={styles.ctaLink}>Book a space</a>
              </div>
            )}
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Upcoming events</h2>
              <a className={styles.sectionAction} href="/dashboard/events">Explore</a>
            </div>
            {isLoading ? (
              <div className={styles.skeletonList} />
            ) : upcomingEvents.length > 0 ? (
              <ul className={styles.simpleList}>
                {upcomingEvents.map(ev => (
                  <li key={ev.id}>
                    <a href={`/dashboard/events/${ev.id}`} className={styles.simpleListItem}>
                      <div>
                        <div className={styles.simpleListPrimary}>{ev.title}</div>
                        <div className={styles.simpleListSecondary}>{formatDate(ev.date)}</div>
                      </div>
                      <div className={styles.simpleListAction}>
                        <ArrowRight size={14} />
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <div className={styles.emptyStateBox}>
                <p>No upcoming events.</p>
                <a href="/dashboard/events" className={styles.ctaLink}>Browse events</a>
              </div>
            )}
          </section>
        </div>

        {/* Quick actions */}
        <div className={styles.sectionSpacer} />
        <div className={styles.actionGrid}>
          {(isLoading ? Array.from({ length: role === 'ORG_ADMIN' ? 5 : 4 }) : actionCards).map((card: any, index: number) => (
            isLoading ? (
              <div key={index} className={styles.skeletonCard}>
                <div className={styles.skeletonIcon}></div>
                <div className={styles.skeletonContent}>
                  <div className={styles.skeletonTitle}></div>
                  <div className={styles.skeletonText}></div>
                </div>
              </div>
            ) : (
              card.visible && (
                <a key={index} href={card.href} className={styles.actionCard}>
                  <div className={styles.cardIconWrapper}>{card.icon}</div>
                  <div>
                    <h2 className={styles.cardTitle}>{card.title}</h2>
                    <p className={styles.cardDescription}>{card.description}</p>
                  </div>
                  <ArrowRight size={20} className={styles.cardArrow} />
                </a>
              )
            )
          ))}
        </div>

        {error && <p style={{ color: '#ef4444', marginTop: '1rem' }}>{error}</p>}
      </main>
    </div>
  );
}