'use client';

import { redirect } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import InstallPwaButton from '@/components/common/InstallPwaButton';
import { ArrowRight, BookUser, Building, CalendarCheck, CalendarDays, Contact, Loader2 } from 'lucide-react';
import { getCookie } from '@/lib/cookieUtils'; 
import styles from './Dashboard.module.css';
import { api } from '@/lib/api.client';

interface DashboardData {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    credits: number;
  };
  organization?: {
    id: string;
    name: string;
    member_count: number;
    total_credits: number;
  };
  upcomingBookings: Array<{
    id: string;
    room_type_name: string;
    room_instance_name: string;
    room_icon: string;
    location_name: string;
    start_time: string;
    end_time: string;
    status: string;
    guests_count: number;
    guests_preview: string[];
  }>;
  recentBookings: Array<{
    id: string;
    room_type_name: string;
    room_instance_name: string;
    room_icon: string;
    location_name: string;
    start_time: string;
    end_time: string;
    status: string;
  }>;
  supportTickets: Array<{
    id: string;
    subject: string;
    description: string;
    status: string;
    created_at: string;
    response?: string;
  }>;
  upcomingEvents: Array<{
    id: string;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    location: string;
    is_registered: boolean;
  }>;
  availableRoomTypes: Array<{
    id: string;
    name: string;
    room_icon: string;
    location_name: string;
    capacity: number;
    credits_per_booking: number;
    available_instances: number;
  }>;
  stats: {
    totalBookings: number;
    upcomingBookings: number;
    totalTickets: number;
    openTickets: number;
    eventRegistrations: number;
  };
}

export default function DashboardClient() {
  const [session, setSession] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [role, setRole] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = getCookie("accessToken");
    setSession(accessToken);

    if (accessToken) {
      setUserName(getCookie("name") || "");
      setRole(getCookie("role") || "");
    }
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!session) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await api.get({ accessToken: session }, '/api/dashboard');
        setDashboardData(data);
        setUserName(data.user.name);
        setRole(data.user.role);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchDashboardData();
    }
  }, [session]);

  if (isClient && !session) {
    redirect('/login');
  }

  if (isLoading) {
    return (
      <div className={styles.pageContainer}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Loader2 className={styles.loaderIcon} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.pageContainer}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <div className={styles.welcomeMessage}>
          <h1 className={styles.welcomeTitle}>
            Welcome, {userName || '...'}!
          </h1>
          <p className={styles.welcomeSubtitle}>Your workspace dashboard is ready.</p>
          {dashboardData && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'hsl(var(--muted-foreground))' }}>
              Credits: {dashboardData.user.credits} • Upcoming: {dashboardData.stats.upcomingBookings} bookings
            </div>
          )}
        </div>
        <div className={styles.headerActions}>
          <InstallPwaButton />
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.actionGrid}>
          {role === 'ORG_ADMIN' && (
            <a href="/dashboard/manage-organization" className={styles.actionCard}>
              <div className={styles.cardIconWrapper}>
                <Building size={28} className={styles.cardIcon} />
              </div>
              <div>
                <h2 className={styles.cardTitle}>Manage Org</h2>
                <p className={styles.cardDescription}>Manage organization members and settings.</p>
              </div>
              <ArrowRight size={20} className={styles.cardArrow} />
            </a>
          )}
          <a href="/dashboard/find-room" className={styles.actionCard}>
            <div className={styles.cardIconWrapper}>
              <CalendarCheck size={28} className={styles.cardIcon} />
            </div>
            <div>
              <h2 className={styles.cardTitle}>Book a Space</h2>
              <p className={styles.cardDescription}>Find and reserve an available meeting room or private office.</p>
            </div>
            <ArrowRight size={20} className={styles.cardArrow} />
          </a>
          <a href="/dashboard/my-bookings" className={styles.actionCard}>
            <div className={styles.cardIconWrapper}>
              <BookUser size={28} className={styles.cardIcon} />
            </div>
            <div>
              <h2 className={styles.cardTitle}>My Bookings</h2>
              <p className={styles.cardDescription}>View your upcoming reservations and booking history.</p>
            </div>
            <ArrowRight size={20} className={styles.cardArrow} />
          </a>

          <a href="/dashboard/member-book" className={styles.actionCard}>
            <div className={styles.cardIconWrapper}>
              <Contact size={28} className={styles.cardIcon} />
            </div>
            <div>
              <h2 className={styles.cardTitle}>Member Directory</h2>
              <p className={styles.cardDescription}>Connect with other members in your workspace.</p>
            </div>
            <ArrowRight size={20} className={styles.cardArrow} />
          </a>

          <a href="/dashboard/events" className={styles.actionCard}>
            <div className={styles.cardIconWrapper}>
              <CalendarDays size={28} className={styles.cardIcon} />
            </div>
            <div>
              <h2 className={styles.cardTitle}>Community Events</h2>
              <p className={styles.cardDescription}>View upcoming events and manage your registrations.</p>
            </div>
            <ArrowRight size={20} className={styles.cardArrow} />
          </a>
        </div>
      </main>
    </div>
  );
}