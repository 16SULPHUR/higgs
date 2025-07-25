'use client';

import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api.client';
import { Pencil, Trash2, Loader2 } from 'lucide-react';
import styles from '@/components/rooms/RoomsTable.module.css';

interface PlansTableProps {
  plans: any[];
  onUpdate: () => void;
  session: any;
}

export default function PlansTable({ plans, onUpdate, session }: PlansTableProps) {
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const handleDelete = async (planId: string, planName: string) => {
        if (confirm(`Are you sure you want to delete the "${planName}" plan?`)) {
            setIsDeleting(planId);
            try {
                await api(session).delete(`/api/admin/plans/${planId}`);
                alert('Plan deleted successfully.');
                onUpdate();
            } catch (error: any) {
                alert(`Error: ${error.message}`);
            } finally {
                setIsDeleting(null);
            }
        }
    };

    return (
        <table className={styles.table}>
            <thead>
                <tr><th>Plan Name</th><th>Credits</th><th>Price</th><th></th></tr>
            </thead>
            <tbody>
                {plans.map((plan) => (
                    <tr key={plan.id}>
                        <td>{plan.name}</td>
                        <td>{plan.plan_credits}</td>
                        <td>₹{parseFloat(plan.price).toFixed(2)}</td>
                        <td className={styles.actions}>
                            <a href={`/admin/dashboard/plans/${plan.id}/edit`} className={styles.iconButton} title="Edit"><Pencil size={16} /></a>
                            <button onClick={() => handleDelete(plan.id, plan.name)} className={`${styles.iconButton} ${styles.deleteButton}`} title="Delete" disabled={!!isDeleting}>
                                {isDeleting === plan.id ? <Loader2 size={16} className={styles.spinner} /> : <Trash2 size={16} />}
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}