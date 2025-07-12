import Link from 'next/link';
import { api } from '@/lib/apiClient';
import OrgsTable from '@/components/orgs/OrgsTable';
import styles from '../rooms/RoomsPage.module.css';  
import { Plus } from 'lucide-react';

export default async function OrgsPage() {
  const [orgs, plans, users] = await Promise.all([
    api.get('/api/admin/orgs', ['orgs']),
    api.get('/api/admin/plans', ['plans']),
    api.get('/api/admin/users/summary', ['users'])        
  ]);

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Organizations</h1>
          <p className={styles.description}>Create and manage client organizations and their plans.</p>
        </div>
        <Link href="/admin/dashboard/organizations/new" className={styles.addButton}>
          <Plus size={16} />
          <span>Create Organization</span>
        </Link>
      </div>
      <div className={styles.tableContainer}>
        <OrgsTable organizations={orgs} plans={plans} users={users} />
      </div>
    </div>
  );
}