'use client';

import { useState } from 'react';
import { api } from '@/lib/api.client';
import styles from './SetAdminModal.module.css';

interface SetAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  orgId: string;
  users: any[];
  onUpdate: () => void;
  session: any;
}

export default function SetAdminModal({ isOpen, onClose, orgId, users, onUpdate, session }: SetAdminModalProps) {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) {
      setError('Please select a user.');
      return;
    }
    setIsSubmitting(true);
    setError('');

    try {
        const result = await api.post(session, `/api/admin/orgs/${orgId}/set-admin`, { user_id: selectedUserId });
        alert(result.message || 'Organization admin updated successfully!');
        onUpdate();
        onClose();
    } catch (err: any) {
        setError(err.message);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Assign Organization Admin</h2>
        <p className={styles.description}>Select a user to grant them admin privileges for this organization.</p>
        <form onSubmit={handleSubmit}>
          <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)} className={styles.select} required disabled={isSubmitting}>
            <option value="" disabled>Select a user...</option>
            {users.length > 0 ? (
              users.map(user => <option key={user.id} value={user.id}>{user.name} ({user.email})</option>)
            ) : (
              <option disabled>No users are members of this organization.</option>
            )}
          </select>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={`${styles.button} ${styles.secondary}`} disabled={isSubmitting}>Cancel</button>
            <button type="submit" className={styles.button} disabled={!users.length || isSubmitting}>{isSubmitting ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}