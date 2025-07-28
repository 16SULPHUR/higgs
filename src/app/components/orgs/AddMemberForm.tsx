'use client';

import { useState } from 'react';
import { api } from '@/lib/api.client';
import styles from './AddMemberForm.module.css';
import { useSessionContext } from '@/contexts/SessionContext';

export default function AddMemberForm({ orgId, availableUsers, onUpdate }: { orgId: string, availableUsers: any[], onUpdate: () => void }) {
    const [selectedUserId, setSelectedUserId] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const session = useSessionContext();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUserId) { setError('You must select a user.'); return; }
        setIsSubmitting(true);
        setError(null);
        try {
            await api.patch(session, `/api/admin/users/${selectedUserId}`, { organization_id: orgId });
            alert('User added successfully!');
            setSelectedUserId('');
            onUpdate();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return ( <form onSubmit={handleSubmit} className={styles.form}><p className={styles.formDescription}>Only users not in an organization will appear here.</p><div className={styles.inputGroup}><label htmlFor="user-select">User</label><select id="user-select" value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)} className={styles.select} required disabled={availableUsers.length === 0}><option value="" disabled>Select a user...</option>{availableUsers.map(user => (<option key={user.id} value={user.id}>{user.name} ({user.email})</option>))}</select></div>{error && <p className={styles.error}>{error}</p>}<button type="submit" className={styles.button} disabled={isSubmitting || availableUsers.length === 0}>{isSubmitting ? 'Adding...' : 'Add User'}</button></form> );
}