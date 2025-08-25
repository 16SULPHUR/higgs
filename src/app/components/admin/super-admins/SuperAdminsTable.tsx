'use client';

import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api.client';
import { Plus, ShieldMinus, X } from 'lucide-react';
import styles from '../location-admins/LocationAdminsTable.module.css';
import modalStyles from './SuperAdminsModal.module.css';
import { getDecodedToken } from '@/lib/tokenUtils';

interface SuperAdmin {
  id: string;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export default function SuperAdminsTable({ session }: { session: any }) {
  const [items, setItems] = useState<SuperAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);

  const [promoteOpen, setPromoteOpen] = useState(false);
  const [locationAdmins, setLocationAdmins] = useState<any[]>([]);
  const [promoteTarget, setPromoteTarget] = useState('');
  const [promoteLoading, setPromoteLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await api.get(session, '/api/admin/super-admins');
      setItems(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load super admins');
    } finally {
      setLoading(false);
    }
  };

  const fetchLocationAdmins = async () => {
    try {
      const data = await api.get(session, '/api/admin/location-admins');
      setLocationAdmins(data);
    } catch {}
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName || !inviteEmail) return;
    setInviteLoading(true);
    try {
      await api.post(session, '/api/admin/super-admins', {
        mode: 'invite',
        name: inviteName,
        email: inviteEmail,
      });
      setInviteOpen(false);
      setInviteName('');
      setInviteEmail('');
      await fetchData();
      alert('Invite sent');
    } catch (err: any) {
      alert(err.message || 'Failed to invite');
    } finally {
      setInviteLoading(false);
    }
  };

  const handleOpenPromote = async () => {
    setPromoteOpen(true);
    await fetchLocationAdmins();
  };

  const handlePromote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoteTarget) return;
    setPromoteLoading(true);
    try {
      await api.post(session, '/api/admin/super-admins', {
        mode: 'promote',
        adminId: promoteTarget,
      });
      setPromoteOpen(false);
      setPromoteTarget('');
      await fetchData();
      alert('Promoted to super admin');
    } catch (err: any) {
      alert(err.message || 'Failed to promote');
    } finally {
      setPromoteLoading(false);
    }
  };

  const handleDemote = async (id: string) => {
    if (!confirm('Demote/deactivate this super admin?')) return;
    try {
      await api.delete(session, `/api/admin/super-admins/${id}`);
      await fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to update');
    }
  };

  if (loading) return <div className={styles.loading}>Loading super admins...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  console.log("session")
  console.log(session)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Super Admins</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className={styles.addButton} onClick={() => setInviteOpen(true)}>
            <Plus size={16} /> Add Super Admin
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No super admins yet.</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((sa) => (
                <tr key={sa.id}>
                  <td>{sa.name}</td>
                  <td>{sa.email}</td>
                  <td>
                    <span className={`${styles.statusToggle} ${sa.is_active ? styles.active : styles.inactive}`}>
                      {sa.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{new Date(sa.created_at).toLocaleString()}</td>
                  <td>
                    {sa.is_active && sa.id !== getDecodedToken(session.accessToken).id && (
                      <button className={styles.statusToggle} onClick={() => handleDemote(sa.id)}>
                        <ShieldMinus size={14} /> Deactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {inviteOpen && (
        <div className={modalStyles.overlay} onClick={() => setInviteOpen(false)}>
          <div className={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={modalStyles.header}>
              <h3 className={modalStyles.title}>Invite Super Admin</h3>
              <button className={modalStyles.closeButton} onClick={() => setInviteOpen(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleInvite} className={modalStyles.form}>
              <input className={modalStyles.input} placeholder="Full name" value={inviteName} onChange={(e) => setInviteName(e.target.value)} />
              <input className={modalStyles.input} placeholder="Email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
              <div className={modalStyles.actions}>
                <button type="button" className={`${modalStyles.button} ${modalStyles.secondary}`} onClick={() => setInviteOpen(false)}>Cancel</button>
                <button type="submit" className={modalStyles.button} disabled={inviteLoading}>{inviteLoading ? 'Sending...' : 'Send Invite'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {promoteOpen && (
        <div className={modalStyles.overlay} onClick={() => setPromoteOpen(false)}>
          <div className={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={modalStyles.header}>
              <h3 className={modalStyles.title}>Promote Location Admin</h3>
              <button className={modalStyles.closeButton} onClick={() => setPromoteOpen(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handlePromote} className={modalStyles.form}>
              <select className={modalStyles.select} value={promoteTarget} onChange={(e) => setPromoteTarget(e.target.value)}>
                <option value="">Select a location admin</option>
                {locationAdmins.map((la: any) => (
                  <option key={la.id} value={la.id}>{la.name} - {la.email}</option>
                ))}
              </select>
              <div className={modalStyles.actions}>
                <button type="button" className={`${modalStyles.button} ${modalStyles.secondary}`} onClick={() => setPromoteOpen(false)}>Cancel</button>
                <button type="submit" className={modalStyles.button} disabled={promoteLoading}>{promoteLoading ? 'Promoting...' : 'Promote'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


