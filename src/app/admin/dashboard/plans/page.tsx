import Link from 'next/link';
import { api } from '@/lib/apiClient';
import PlansTable from '@/components/plans/PlansTable';
import styles from '../rooms/RoomsPage.module.css'; 
import { Plus } from 'lucide-react';

export default async function PlansPage() {
  const plans = await api.get('/api/admin/plans', ['plans']);
  console.log(plans)

  return (
    <div>
      <div className={styles.header}>
        <div>
            <h1 className={styles.title}>Subscription Plans</h1>
            <p className={styles.description}>Create and manage pricing plans for organizations.</p>
        </div>
        <a href="/admin/dashboard/plans/new" className={styles.addButton}>
            <Plus size={16} />
            <span>Add New Plan</span>
        </a>
      </div>
      <div className={styles.tableContainer}>
        <PlansTable plans={plans} />
      </div>
    </div>
  );
}