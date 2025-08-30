'use client';

import { useState, useEffect } from 'react'; 
import { api } from '@/lib/api.client';
import { Plus, Loader2 } from 'lucide-react'; 
import TableSkeleton from '@/components/common/TableSkeleton';
import styles from './OrganizationsPage.module.css';  
import OrgsTable from '@/components/orgs/OrgsTable';
import { useSessionContext } from '@/contexts/SessionContext';

export default function OrgsPage() {
  const session = useSessionContext();
  const [data, setData] = useState<{ orgs: any[], plans: any[], users: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!session) { 
      setData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const [orgs, plans, users] = await Promise.all([
        api.get(session, '/api/admin/orgs'),
        api.get(session, '/api/admin/plans'),
        api.get(session, '/api/admin/users/summary')
      ]);
      setData({ orgs, plans, users });
    } catch (err: any) {
      setError(err.message || 'Failed to load organizations data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchData();
    } else {
      // If session disappears, reset state accordingly
      setData(null);
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
    if (data) {
      return (
        <div className={styles.tableContainer}>
          <OrgsTable 
          session={session}
            organizations={data.orgs} 
            plans={data.plans} 
            users={data.users} 
            onUpdate={fetchData} 
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Organizations</h1>
          <p className={styles.description}>
            Create and manage client organizations and their plans.
          </p>
        </div>
        <a href="/admin/dashboard/organizations/new" className={styles.addButton}>
          <Plus size={16} />
          <span>Create Organization</span>
        </a>
      </div>
      {renderContent()}
    </div>
  );
}
