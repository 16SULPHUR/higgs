import { api } from '@/lib/apiClient';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import CreateUserForm from '@/components/admin/users/CreateUserForm';
import styles from '../../rooms/RoomsPage.module.css';

export default async function NewUserPage() {
  const organizations = await api.get('/api/admin/orgs');
  
  return (
    <div>
      <div className={styles.header}>
        <div>
          <Link href="/admin/dashboard/users" className={styles.backButton}>
            <ArrowLeft size={16} />
            <span>Back to Users</span>
          </Link>
          <h1 className={styles.title}>Create New User</h1>
          <p className={styles.description}>
            Create a new user account and send them a welcome email with their login credentials.
          </p>
        </div>
      </div>
      <CreateUserForm organizations={organizations} />
    </div>
  );
}