'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api.client';
import { Plus, Loader2 } from 'lucide-react';
import UsersTable from '@/components/admin/users/UsersTable';
import TableSkeleton from '@/components/common/TableSkeleton';
import styles from './AdminUsersPage.module.css';
import { useSession } from '@/contexts/SessionContext';

export default function AdminUsersPage() {
  const session = useSession();
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

  const addToOrg = async (userId: string, orgId: string) => {
    try {
      await api.post(session, `/api/admin/users/${userId}/add-to-org`, { orgId });
      fetchData(); // Refresh data
    } catch (err: any) {
      alert('Failed to add user to organization: ' + err.message);
    }
  };

  const removeFromOrg = async (userId: string) => {
    try {
      await api.delete(session, `/api/admin/users/${userId}/remove-from-org`);
      fetchData(); // Refresh data
    } catch (err: any) {
      alert('Failed to remove user from organization: ' + err.message);
    }
  };

  const addCredits = async () => {
    if (!creditsUserId || !creditsAmount) return;
    
    setCreditsLoading(true);
    setCreditsError(null);
    
    try {
      await api.post(session, `/api/admin/users/${creditsUserId}/add-credits`, {
        credits: parseInt(creditsAmount)
      });
      
      setCreditsAmount('');
      setCreditsUserId(null);
      fetchData(); // Refresh data
    } catch (err: any) {
      setCreditsError(err.message || 'Failed to add credits');
    } finally {
      setCreditsLoading(false);
    }
  };

  const filteredUsers = () => {
    if (tab === 'all') return users;
    if (tab === 'individuals') return users.filter(u => !u.org_id);
    if (tab === 'org_members') return users.filter(u => u.org_id);
    return users;
  };

  if (session === undefined) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#6b7280'
      }}>
        Loading users...
      </div>
    );
  }

  if (session === null) {
    return null;
  }

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Users</h1>
          <p className={styles.subtitle}>Manage user accounts and organizations</p>
        </div>
        <Link href="/admin/dashboard/users/new" className={styles.addButton}>
          <Plus size={20} />
          Add User
        </Link>
      </div>

      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${tab === 'all' ? styles.active : ''}`}
          onClick={() => setTab('all')}
        >
          All Users ({users.length})
        </button>
        <button 
          className={`${styles.tab} ${tab === 'individuals' ? styles.active : ''}`}
          onClick={() => setTab('individuals')}
        >
          Individuals ({users.filter(u => !u.org_id).length})
        </button>
        <button 
          className={`${styles.tab} ${tab === 'org_members' ? styles.active : ''}`}
          onClick={() => setTab('org_members')}
        >
          Organization Members ({users.filter(u => u.org_id).length})
        </button>
      </div>

      {isLoading ? (
        <div className={styles.tableContainer}>
          <TableSkeleton cols={7} />
        </div>
      ) : error ? (
        <div className={styles.error}>
          <p>Error: {error}</p>
          <button onClick={fetchData} className={styles.retryButton}>
            <Loader2 size={16} />
            Retry
          </button>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <UsersTable 
            users={filteredUsers()}
            session={session}
            onUpdate={fetchData}
            onGiveCredits={(userId) => setCreditsUserId(userId)}
          />
        </div>
      )}

      {/* Add to Organization Modal */}
      {modalUserId && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Add User to Organization</h3>
            <select 
              value={selectedOrgId} 
              onChange={(e) => setSelectedOrgId(e.target.value)}
              className={styles.select}
            >
              <option value="">Select Organization</option>
              {orgs.map(org => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
            <div className={styles.modalActions}>
              <button 
                onClick={() => {
                  if (selectedOrgId) {
                    addToOrg(modalUserId, selectedOrgId);
                    setModalUserId(null);
                    setSelectedOrgId('');
                  }
                }}
                disabled={!selectedOrgId}
                className={styles.primaryButton}
              >
                Add
              </button>
              <button 
                onClick={() => {
                  setModalUserId(null);
                  setSelectedOrgId('');
                }}
                className={styles.secondaryButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Credits Modal */}
      {creditsUserId && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Add Credits</h3>
            <input
              type="number"
              placeholder="Number of credits"
              value={creditsAmount}
              onChange={(e) => setCreditsAmount(e.target.value)}
              className={styles.input}
            />
            {creditsError && <p className={styles.error}>{creditsError}</p>}
            <div className={styles.modalActions}>
              <button 
                onClick={addCredits}
                disabled={!creditsAmount || creditsLoading}
                className={styles.primaryButton}
              >
                {creditsLoading ? <Loader2 size={16} /> : 'Add Credits'}
              </button>
              <button 
                onClick={() => {
                  setCreditsUserId(null);
                  setCreditsAmount('');
                  setCreditsError(null);
                }}
                className={styles.secondaryButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
