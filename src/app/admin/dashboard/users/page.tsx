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
  const [orgs, setOrgs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'all' | 'individuals' | 'org_members'>('individuals');
  const [modalUserId, setModalUserId] = useState<string | null>(null);
  const [selectedOrgId, setSelectedOrgId] = useState<string>('');
  const [creditsUserId, setCreditsUserId] = useState<string | null>(null);
  const [creditsAmount, setCreditsAmount] = useState<string>('');
  const [creditsError, setCreditsError] = useState<string | null>(null);
  const [creditsLoading, setCreditsLoading] = useState<boolean>(false);

  const fetchData = async () => {
    if (!session) { 
      setUsers([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const [allUsers, allOrgs] = await Promise.all([
        api.get(session, '/api/admin/users'),
        api.get(session, '/api/admin/orgs'),
      ]);
      setUsers(allUsers);
      setOrgs(allOrgs);
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
      setUsers([]);
      
      setIsLoading(false);
      setError(null);
    }
  }, [session]);

  const addToOrg = async (userId: string, organization_id: string, role: string = 'ORG_USER') => {
    if (!session) return;
    await api.patch(session, `/api/admin/users/${userId}`, { organization_id, role });
    await fetchData();
  };

  const giveCredits = async (userId: string) => {
    setCreditsUserId(userId);
    setCreditsAmount('');
  };

  const submitCredits = async () => {
    if (!creditsUserId) return;
    setCreditsError(null);
    const creditsToAssign = Number(creditsAmount);
    if (Number.isNaN(creditsToAssign)) { setCreditsError('Enter a valid number'); return; }
    try {
      setCreditsLoading(true);
      await api.post(session, `/api/admin/assign-credits/${creditsUserId}`, { creditsToAssign });
      setCreditsUserId(null);
      setCreditsAmount('');
      await fetchData();
    } catch (err: any) {
      setCreditsError(err.message || 'Failed to assign credits.');
    } finally {
      setCreditsLoading(false);
    }
  };

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
      {(() => {
        const individualUsers = users.filter((u: any) => u.role === 'INDIVIDUAL_USER');
        const orgMembers = users.filter((u: any) => u.role === 'ORG_USER' || u.role === 'ORG_ADMIN');
        const filteredUsers = tab === 'all' ? users : tab === 'individuals' ? individualUsers : orgMembers;
        return (
          <>
            <div className={styles.tabs}>
              <button className={`${styles.tab} ${tab === 'all' ? styles.tabActive : ''}`} onClick={() => setTab('all')}>All ({users.length})</button>
              <button className={`${styles.tab} ${tab === 'individuals' ? styles.tabActive : ''}`} onClick={() => setTab('individuals')}>Individuals ({individualUsers.length})</button>
              <button className={`${styles.tab} ${tab === 'org_members' ? styles.tabActive : ''}`} onClick={() => setTab('org_members')}>Org Members ({orgMembers.length})</button>
            </div>
            <div className={styles.tableContainer}>
              {isLoading ? (
                <TableSkeleton cols={5} />
              ) : error ? (
                <p>Error: {error}</p>
              ) : (
                <UsersTable session={session} users={filteredUsers} onUpdate={fetchData} onGiveCredits={giveCredits} />
              )}
            </div>
          </>
        );
      })()}

      {modalUserId && (
        <div className={styles.modalOverlay} onClick={() => setModalUserId(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Select organization</h3>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="org-select">Organization</label>
              <select id="org-select" value={selectedOrgId} onChange={(e) => setSelectedOrgId(e.target.value)}>
                <option value="">Select organization</option>
                {orgs.map((org:any) => (
                  <option key={org.id} value={org.id}>{org.name}</option>
                ))}
              </select>
            </div>
            <div className={styles.actionsRow}>
              <button className={styles.secondaryButton} onClick={() => setModalUserId(null)}>Cancel</button>
              <button className={styles.primaryButton} disabled={!selectedOrgId} onClick={async () => {
                if (!selectedOrgId) return;
                await addToOrg(modalUserId!, selectedOrgId, 'ORG_USER');
                setModalUserId(null);
              }}>Add to Org</button>
            </div>
          </div>
        </div>
      )}

      {creditsUserId && (
        <div className={styles.modalOverlay} onClick={() => setCreditsUserId(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Assign credits to user</h3>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="credits-input">Credits (use negative to remove)</label>
              <input id="credits-input" type="number" value={creditsAmount} onChange={(e) => setCreditsAmount(e.target.value)} />
              <span className={styles.hint}>Users in an organization cannot receive individual credits.</span>
            </div>
            {creditsError && <p className={styles.errorText}>{creditsError}</p>}
            <div className={styles.actionsRow}>
              <button className={styles.secondaryButton} onClick={() => setCreditsUserId(null)}>Cancel</button>
              <button className={styles.primaryButton} onClick={submitCredits} disabled={creditsLoading}>{creditsLoading ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
