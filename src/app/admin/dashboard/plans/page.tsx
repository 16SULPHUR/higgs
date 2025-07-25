'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api.client';
import { Plus, Loader2 } from 'lucide-react'; 
import TableSkeleton from '@/components/common/TableSkeleton';
import styles from '@/admin/dashboard/rooms/RoomsPage.module.css';
import PlansTable from '@/components/plans/PlansTable';
import { useSessionContext } from '@/contexts/SessionContext';

export default function PlansPage() {
  const session = useSessionContext();
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!session) {
      // No session - clear plans and stop loading
      setPlans([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await api(session).get('/api/admin/plans');
      setPlans(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load plans.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchData();
    } else {
      // If session disappears, reset state accordingly
      setPlans([]);
      setIsLoading(false);
      setError(null);
    }
  }, [session]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={styles.tableContainer}>
          <TableSkeleton cols={4} />
        </div>
      );
    }
    if (error) {
      return <p>Error: {error}</p>;
    }
    return (
      <div className={styles.tableContainer}>
        <PlansTable session={session} plans={plans} onUpdate={fetchData} />
      </div>
    );
  };

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Subscription Plans</h1>
          <p className={styles.description}>
            Create and manage pricing plans for organizations.
          </p>
        </div>
        <a href="/admin/dashboard/plans/new" className={styles.addButton}>
          <Plus size={16} />
          <span>Add New Plan</span>
        </a>
      </div>
      {renderContent()}
    </div>
  );
}
