'use client';

import { useState } from 'react';
import { api } from '@/lib/api.client';
import { XCircle } from 'lucide-react';
import styles from './CancelPlanButton.module.css';

export default function CancelPlanButton({ orgId, orgName, onUpdate }: { orgId: string, orgName: string, onUpdate: () => void }) {
    const [isPending, setIsPending] = useState(false);

    const handleCancel = async () => {
        if (confirm(`Cancel subscription for "${orgName}"? This will remove their plan and reset credits to zero.`)) {
            setIsPending(true);
            try {
                const result = await api.delete(`/api/admin/orgs/${orgId}/plan`);
                alert(result.message || 'Plan cancelled successfully.');
                onUpdate();
            } catch (error: any) {
                alert(`Error: ${error.message}`);
            } finally {
                setIsPending(false);
            }
        }
    };

    return (
        <button onClick={handleCancel} disabled={isPending} className={styles.cancelButton}>
            <XCircle size={16} />
            <span>{isPending ? 'Cancelling...' : 'Cancel Subscription'}</span>
        </button>
    );
}