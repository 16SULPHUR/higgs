'use client';

import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';
import { deletePlan } from '@/actions/planActions';
import styles from '../rooms/RoomsTable.module.css'; 

export default function PlansTable({ plans }: { plans: any[] }) {
    const handleDelete = async (planId: string, planName: string) => {
        if (confirm(`Are you sure you want to delete the "${planName}" plan? This cannot be undone.`)) {
            const result = await deletePlan(planId);
            if (!result.success) {
                alert(`Error: ${result.message}`);
            } else {
                alert('Plan deleted successfully.');
            }
        }
    };

    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th>Plan Name</th>
                    <th>Credits</th>
                    <th>Price</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {plans.map((plan) => (
                    <tr key={plan.id}>
                        <td>{plan.name}</td>
                        <td>{plan.plan_credits}</td>
                        <td>₹ {parseFloat(plan.price).toFixed(2)}</td> 
                        <td className={styles.actions}>
                            <Link href={`/dashboard/plans/${plan.id}/edit`} className={styles.iconButton} title="Edit">
                                <Pencil size={16} />
                            </Link>
                            <button onClick={() => handleDelete(plan.id, plan.name)} className={`${styles.iconButton} ${styles.deleteButton}`} title="Delete">
                                <Trash2 size={16} />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}