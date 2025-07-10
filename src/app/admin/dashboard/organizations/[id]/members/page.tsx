import { api } from '@/lib/apiClient';
import styles from './ManageMembers.module.css';
import AddMemberForm from '@/components/orgs/AddMemberForm';
import CurrentMembersList from '@/components/orgs/CurrentMembersList';
import { use } from 'react';

interface ManageMembersPageProps {
  params?: {
    id?: string;
  };
}

export default async function ManageMembersPage({ params }: ManageMembersPageProps) {

  const { id } = params ?? {};

  const [org, allUsers] = await Promise.all([
    api.get(`/api/admin/orgs/${id}`),
    api.get('/api/admin/users', ['users'])
  ]);

  const currentMembers = allUsers.filter((user: any) => user.organization_id === org.id);
  const availableUsers = allUsers.filter((user: any) => user.organization_id === null);

  return (
    <div>
      <h1 className={styles.title}>Manage Members for {org.name}</h1>
      <p className={styles.description}>Add existing users to this organization or view and remove current members.</p>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Add User to Organization</h2>
          <AddMemberForm orgId={org.id} availableUsers={availableUsers} />
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Current Members ({currentMembers.length})</h2>

          <CurrentMembersList members={currentMembers} />
        </div>
      </div>
    </div>
  );
}