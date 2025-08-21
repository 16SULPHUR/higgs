"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Dashboard.module.css';
import { 
  Building2,
  BarChart3,
  MapPin,
  Users,
  CalendarDays,
  DoorOpen,
  Ticket,
  Activity,
  PlusCircle,
  UserPlus
} from 'lucide-react';
import { useSessionContext } from '@/contexts/SessionContext';
import { getDecodedToken } from '@/lib/tokenUtils';
import { getCookie } from '@/lib/cookieUtils';
import { api } from '@/lib/api.client';

export default function AdminDashboardPage() {
  const router = useRouter();
  const session = useSessionContext();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, [session]);

  const userName = mounted ? (getCookie('name') || '') : '';
  const role: string = mounted ? (getCookie('role') || '') : '';
  const isSuperAdmin = role === 'SUPER_ADMIN';

  const [todaysBookings, setTodaysBookings] = useState<number>(0);
  const [roomUtilization, setRoomUtilization] = useState<number>(0);
  const [upcomingEvents, setUpcomingEvents] = useState<number>(0);
  const [openTickets, setOpenTickets] = useState<number>(0);

  useEffect(() => {
    if (session === undefined) return;
    if (session === null) {
      router.replace('/login');
      return;
    }
    try {
      const decodedData = getDecodedToken(session?.accessToken);
      if (decodedData?.type !== 'admin') {
        router.replace('/login');
      }
    } catch {
      router.replace('/login');
    }
  }, [session, router]);

  // Fetch stats (unconditional hook; guarded inside)
  useEffect(() => {
    if (session === undefined || session === null) return;
    let isCancelled = false;

    const run = async () => {
      try {
        const [bookingsRes, roomsRes, eventsRes, ticketsRes] = await Promise.all([
          api.get(null, '/api/admin/bookings'),
          api.get(null, '/api/admin/rooms'),
          api.get(null, '/api/admin/events'),
          api.get(null, '/api/admin/support-tickets'),
        ]);

        if (isCancelled) return;

        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        const todaysCount = (bookingsRes || []).filter((b: any) => {
          const start = new Date(b.start_time);
          return start >= startOfDay && start < endOfDay;
        }).length;
        setTodaysBookings(todaysCount);

        const activeRooms = (roomsRes || []).filter((r: any) => r.is_active !== false);
        const roomsWithBookingToday = new Set<string>();
        (bookingsRes || []).forEach((b: any) => {
          const start = new Date(b.start_time);
          if (start >= startOfDay && start < endOfDay && b.room_instance_name) {
            roomsWithBookingToday.add(b.room_instance_name);
          }
        });
        const utilization = activeRooms.length > 0 ? Math.round((roomsWithBookingToday.size / activeRooms.length) * 100) : 0;
        setRoomUtilization(utilization);

        const upcoming = (eventsRes || []).filter((e: any) => new Date(e.date) >= startOfDay).length;
        setUpcomingEvents(upcoming);

        const open = (ticketsRes || []).filter((t: any) => t.status === 'OPEN').length;
        setOpenTickets(open);
      } catch (e) {}
    };

    run();
    return () => {
      isCancelled = true;
    };
  }, [session]);

  if (session === undefined) {
    return (
      <div className={styles.loadingState}>Loading admin dashboard...</div>
    );
  }
  if (session === null) return null;


  const superAdminStats = [
    { href: '/admin/dashboard/bookings', label: "Today's Bookings", value: String(todaysBookings), icon: <CalendarDays size={18} />, accent: styles.accentGreen },
    // { href: '/admin/dashboard/rooms', label: 'Room Utilization', value: `${roomUtilization}%`, icon: <DoorOpen size={18} />, accent: styles.accentBlue },
    { href: '/admin/dashboard/events', label: 'Upcoming Events', value: String(upcomingEvents), icon: <Activity size={18} />, accent: styles.accentPurple },
    { href: '/admin/dashboard/tickets', label: 'Open Tickets', value: String(openTickets), icon: <Ticket size={18} />, accent: styles.accentOrange },
  ];

  const locationAdminStats = [
    { href: '/admin/dashboard/bookings', label: "Today's Bookings", value: String(todaysBookings), icon: <CalendarDays size={18} />, accent: styles.accentGreen },
    // { href: '/admin/dashboard/rooms', label: 'Room Utilization', value: `${roomUtilization}%`, icon: <DoorOpen size={18} />, accent: styles.accentBlue },
    { href: '/admin/dashboard/events', label: 'Upcoming Events', value: String(upcomingEvents), icon: <Activity size={18} />, accent: styles.accentPurple },
    { href: '/admin/dashboard/tickets', label: 'Open Tickets', value: String(openTickets), icon: <Ticket size={18} />, accent: styles.accentOrange },
  ];

  const managementLinksSuper = [
    { href: '/admin/dashboard/organizations/new', title: 'Create Organization', desc: 'Set up org and assign a plan', icon: <PlusCircle size={20} /> },
    { href: '/admin/dashboard/location-admins/new', title: 'Add Location Admin', desc: 'Assign admin to a location', icon: <MapPin size={20} /> },
    { href: '/admin/dashboard/room-types', title: 'Manage Room Types', desc: 'Define types and amenities', icon: <DoorOpen size={20} /> },
    { href: '/admin/dashboard/plans', title: 'Plans & Billing', desc: 'Configure pricing and quotas', icon: <BarChart3 size={20} /> },
  ];

  const managementLinksLocation = [
    { href: '/admin/dashboard/rooms', title: 'Manage Rooms', desc: 'Create and update room inventory', icon: <DoorOpen size={20} /> },
    { href: '/admin/dashboard/events/new', title: 'Create Event', desc: 'Schedule and promote events', icon: <Activity size={20} /> },
    { href: '/admin/dashboard/users/new', title: 'Add User', desc: 'Invite a new member', icon: <UserPlus size={20} /> },
    { href: '/admin/dashboard/tickets', title: 'Support Tickets', desc: 'Respond to open tickets', icon: <Ticket size={20} /> },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.welcomeTitle}>{isSuperAdmin ? 'Super Admin Overview' : 'Location Admin Overview'}</h1>
          <p className={styles.welcomeText}>Welcome back{userName ? `, ${userName}` : ''}. Here is your current overview.</p>
        </div>
      </header>

      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          {(isSuperAdmin ? superAdminStats : locationAdminStats).map((s) => (
            <a key={s.label} href={s.href} className={`${styles.statCard} ${s.accent}`}>
              <div className={styles.statIcon}>{s.icon}</div>
              <div className={styles.statContent}>
                <div className={styles.statLabel}>{s.label}</div>
                <div className={styles.statValue}>
                  {s.value}
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Management</h2>
        </div>
        <div className={styles.actionsGrid}>
          {(isSuperAdmin ? managementLinksSuper : managementLinksLocation).map((link) => (
            <a key={link.title} href={link.href} className={styles.actionCard}>
              <div className={styles.actionIconWrap}>{link.icon}</div>
              <div>
                <div className={styles.actionTitle}>{link.title}</div>
                <div className={styles.actionDescription}>{link.desc}</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {null}
    </div>
  );
}