import { api } from '@/lib/apiClient';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import CreateUserForm from '@/components/admin/users/CreateUserForm';
import styles from '../../../rooms/RoomsPage.module.css';

export default async function EditUserPage({ params }: { params?: { id?: string } }) {
  const { id } = params ?? {};
  const [user, organizations] = await Promise.all([
      api.get(`/api/admin/users/${id}`),
      api.get('/api/admin/orgs')
  ]);

  return (
    <div>
      <div className={styles.header}>
        <div>
          <Link href="/admin/dashboard/users" className={styles.backButton}><ArrowLeft size={16} /><span>Back to Users</span></Link>
          <h1 className={styles.title}>Edit User: {user.name}</h1>
          <p className={styles.description}>Update user details and permissions.</p>
        </div>
      </div>
      <CreateUserForm organizations={organizations} initialData={user} />
    </div>
  );
}