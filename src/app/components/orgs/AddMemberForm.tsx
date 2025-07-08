'use client';

import { useState } from 'react';
import { addUserToOrg } from '@/actions/orgActions';

import styles from './AddMemberForm.module.css';

export default function AddMemberForm({ orgId, availableUsers }: { orgId: string, availableUsers: any[] }) {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) {
      setError('You must select a user to add.');
      return;
    }
    setIsSubmitting(true);
    setError(null);

    const result = await addUserToOrg(selectedUserId, orgId);

    if (result.success) {
      alert('User added to organization successfully!');
      setSelectedUserId('');
      
    } else {
      setError(result.message ?? null);
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <p className={styles.formDescription}>Only users who are not already in an organization will appear here.</p>
      <div className={styles.inputGroup}>
        <label htmlFor="user-select">User</label>
        <select
          id="user-select"
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          className={styles.select}
          required
          disabled={availableUsers.length === 0}
        >
          <option value="" disabled>Select a user...</option>
          {availableUsers.map(user => (
            <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
          ))}
        </select>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <button type="submit" className={styles.button} disabled={isSubmitting || availableUsers.length === 0}>
        {isSubmitting ? 'Adding...' : 'Add User'}
      </button>
    </form>
  );
}