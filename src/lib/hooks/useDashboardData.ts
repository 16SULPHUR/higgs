import { useState, useEffect } from 'react';
import { api } from '@/lib/api.client';

interface AppSession {
  accessToken?: string;
  refreshToken?: string;
}

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

interface UseDashboardDataReturn {
  data: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDashboardData(session: AppSession | null): UseDashboardDataReturn {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    if (!session) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const dashboardData = await api.get(session, '/api/dashboard');
      setData(dashboardData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [session]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchDashboardData
  };
}
