'use client';
import { useEffect, useState, useMemo } from 'react';
import { Wallet } from 'lucide-react';
import { useSessionContext } from '@/contexts/SessionContext';
import { api } from '@/lib/api.client';
import styles from './CreditsWidget.module.css';

export default function CreditsWidget() {
  const session = useSessionContext();
  const [userData, setUserData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session) return;
      try {
        setIsLoading(true);
        const data = await api.get(session, '/api/auth/me');
        setUserData(data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchUserData();
    }
  }, [session]);

  const availableCredits = useMemo(() => {
    if (!userData) return 0;
    if (userData.role === 'INDIVIDUAL_USER') return userData.individual_credits || 0;
    return userData.organization_credits_pool || 0;
  }, [userData]);

  if (isLoading) {
    return (
      <div className={styles.creditsWidget}>
        <div className={styles.creditsSkeleton} />
      </div>
    );
  }

  return (
    <div className={styles.creditsWidget}>
      <Wallet size={16} className={styles.creditsIcon} />
      <span className={styles.creditsText}>{availableCredits}</span>
    </div>
  );
}
