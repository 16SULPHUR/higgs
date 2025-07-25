'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api.client';
import { ArrowLeft, Loader2 } from 'lucide-react';
import styles from './ManageMembers.module.css';
import AddMemberForm from '@/components/orgs/AddMemberForm';
import CurrentMembersList from '@/components/orgs/CurrentMembersList';
import { useSessionContext } from '@/contexts/SessionContext';

export default function ManageMembersPage() {
  const session = useSessionContext();
  const params   = useParams();
  const orgId    = params.id as string | undefined;

  const [org, setOrg]           = useState<any>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError]       = useState<string | null>(null);

  const fetchData = async () => {
    if (!session || !orgId) {
      setOrg(null);
      setAllUsers([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [orgData, usersData] = await Promise.all([
        api(session).get(`/api/admin/orgs/${orgId}`),
        api(session).get('/api/admin/users/summary'),
      ]);
      setOrg(orgData);
      setAllUsers(usersData);
    } catch (err: any) {
      setError(err.message || 'Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session && orgId) fetchData();
    else {
      // unauthenticated or missing id
      setLoading(false);
    }
  }, [session, orgId]);

  if (isLoading) {
    return (
      <div className={styles.loadingState}>
        <Loader2 className={styles.loaderIcon} />
      </div>
    );
  }

  if (error) return <p>{error}</p>;
  if (!org)   return <p>Organization not found.</p>;

  const currentMembers  = allUsers.filter(u => u.organization_id === org.id);
  const availableUsers  = allUsers.filter(u => u.organization_id == null);

  return (
    <div>
      <a href="/admin/dashboard/organizations/" className={styles.backButton}>
        <ArrowLeft size={16} /> Back to Organizations
      </a>

      <h1 className={styles.title}>Manage Members for {org.name}</h1>
      <p className={styles.description}>Add or remove users from this organization.</p>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Add User</h2>
          <AddMemberForm
            orgId={org.id}
            availableUsers={availableUsers}
            onUpdate={fetchData}
          />
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            Current Members ({currentMembers.length})
          </h2>
          <CurrentMembersList
          session={session}
            members={currentMembers}
            onUpdate={fetchData}
          />
        </div>
      </div>
    </div>
  );
}
