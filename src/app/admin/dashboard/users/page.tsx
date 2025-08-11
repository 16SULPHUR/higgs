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
  const [pending, setPending] = useState<any[]>([]);
  const [orgs, setOrgs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'all' | 'pending'>('all');
  const [modalUserId, setModalUserId] = useState<string | null>(null);
  const [selectedOrgId, setSelectedOrgId] = useState<string>('');

  const fetchData = async () => {
    if (!session) { 
      setUsers([]);
      setPending([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const [allUsers, pendingUsers, allOrgs] = await Promise.all([
        api.get(session, '/api/admin/users'),
        api.get(session, '/api/admin/users/pending/list'),
        api.get(session, '/api/admin/orgs'),
      ]);
      setUsers(allUsers);
      setPending(pendingUsers);
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
      setPending([]);
      setIsLoading(false);
      setError(null);
    }
  }, [session]);

  const approve = async (userId: string, payload?: { organization_id?: string; role?: string }) => {
    if (!session) return;
    await api.post(session, `/api/admin/users/${userId}/approve`, payload || {});
    await fetchData();
  };
  const reject = async (userId: string, reason?: string) => {
    if (!session) return;
    await api.post(session, `/api/admin/users/${userId}/reject`, { reason });
    await fetchData();
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
      <div className={styles.tabs}>
        <button className={tab==='all' ? styles.tabActive : styles.tab}
                onClick={() => setTab('all')}>All Users</button>
        <button className={tab==='pending' ? styles.tabActive : styles.tab}
                onClick={() => setTab('pending')}>Pending Approvals ({pending.length})</button>
      </div>

      <div className={styles.tableContainer}>
        {isLoading ? (
          <TableSkeleton cols={5} />
        ) : error ? (
          <p>Error: {error}</p>
        ) : tab === 'all' ? (
          <UsersTable session={session} users={users} onUpdate={fetchData} />
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th><th>Email</th><th>Requested Role</th><th>Requested Org</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pending.map((u:any) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.organization_name || '—'}</td>
                  <td className={styles.rowActions}>
                    <button className={styles.secondaryButton} onClick={() => approve(u.id)} title="Approve as Individual">Approve as Individual</button>
                    <button className={styles.primaryButton} onClick={() => { setModalUserId(u.id); setSelectedOrgId(''); }} title="Approve to Organization">Approve to Org</button>
                    <button className={styles.dangerButton} onClick={() => {
                      const reason = prompt('Reason (optional)') || '';
                      reject(u.id, reason);
                    }} title="Reject">Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

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
                await approve(modalUserId, { organization_id: selectedOrgId, role: 'ORG_USER' });
                setModalUserId(null);
              }}>Approve</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
