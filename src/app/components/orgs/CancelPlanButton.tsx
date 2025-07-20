'use client';

import { useTransition } from 'react';
import { XCircle } from 'lucide-react';
import { cancelOrgSubscriptionAction } from '@/actions/orgActions';
import styles from './CancelPlanButton.module.css';

export default function CancelPlanButton({ orgId, orgName }: { orgId: string, orgName: string }) {
    const [isPending, startTransition] = useTransition();

    const handleCancel = () => {
        if (confirm(`Are you sure you want to cancel the subscription for "${orgName}"? This will immediately remove their plan and reset their credits to zero.`)) {
            startTransition(async () => {
                const result = await cancelOrgSubscriptionAction(orgId);
                if (result.success) {
                    alert(result.message);
                } else {
                    alert(`Error: ${result.message}`);
                }
            });
        }
    };

    return (
        <button
            onClick={handleCancel}
            disabled={isPending}
            className={styles.cancelButton}
        >
            <XCircle size={16} />
            <span>{isPending ? 'Cancelling Plan...' : 'Cancel Subscription'}</span>
        </button>
    );
}