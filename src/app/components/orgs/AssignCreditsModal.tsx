'use client';

import { useState } from 'react';
import { api } from '@/lib/api.client';
import styles from './SetAdminModal.module.css';

interface AssignCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  org: any;
  onUpdate: () => void;
  session: any;
}

export default function AssignCreditsModal({ isOpen, onClose, org, onUpdate, session }: AssignCreditsModalProps) {
  const [credits, setCredits] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const creditsToAssign = parseInt(credits);
    if (isNaN(creditsToAssign) || creditsToAssign <= 0) {
      setError('Please enter a valid, positive number.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    try {
        const result = await api(session).post(`/api/admin/assign-credits/${org.id}`, { creditsToAssign });
        alert(result.message || 'Credits assigned successfully!');
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
        <h2 className={styles.title}>Assign Credits to {org.name}</h2>
        <p className={styles.description}>Current credit pool: <strong>{org.credits_pool || 0}</strong>. Enter the amount to add.</p>
        <form onSubmit={handleSubmit}>
          <input type="number" value={credits} onChange={(e) => setCredits(e.target.value)} className={styles.select} placeholder="e.g., 100" required min="1" />
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={`${styles.button} ${styles.secondary}`} disabled={isSubmitting}>Cancel</button>
            <button type="submit" className={styles.button} disabled={isSubmitting}>{isSubmitting ? 'Assigning...' : 'Assign Credits'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}