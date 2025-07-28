'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api.client';
import { Plus, Loader2 } from 'lucide-react';
import UsersTable from '@/components/admin/users/UsersTable';
import TableSkeleton from '@/components/common/TableSkeleton';
import styles from './AdminUsersPage.module.css';
import { useSessionContext } from '@/contexts/SessionContext';

export default function AdminUsersPage() {
  const session = useSessionContext();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!session) { 
      setUsers([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get(session, '/api/admin/users');
      setUsers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load users.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchData();
    } else {
      // If session disappears, reset state accordingly
      setUsers([]);
      setIsLoading(false);
      setError(null);
    }
  }, [session]);

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Manage Users</h1>
          <p className={styles.description}>View, edit, and manage all user accounts.</p>
        </div>
        <a href="/admin/dashboard/users/new" className={styles.addButton}>
          <Plus size={16} />
          <span>Add New User</span>
        </a>
      </div>
      <div className={styles.tableContainer}>
        {isLoading ? (
          <TableSkeleton cols={5} />
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <UsersTable session={session} users={users} onUpdate={fetchData} />
        )}
      </div>
    </div>
  );
}
