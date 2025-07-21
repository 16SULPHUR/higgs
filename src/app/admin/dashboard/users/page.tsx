import { api } from '@/lib/apiClient';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import UsersTable from '@/components/admin/users/UsersTable';
import styles from './AdminUsersPage.module.css';

export default async function AdminUsersPage() {
  const users = await api.get('/api/admin/users', ['admin-users']);

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
        <UsersTable users={users} />
      </div>
    </div>
  );
}