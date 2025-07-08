'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CircleDollarSign, Pencil, Trash2, UserCog, Users } from 'lucide-react';
import SetAdminModal from './SetAdminModal';
import styles from '../rooms/RoomsTable.module.css'; 

import AssignCreditsModal from './AssignCreditsModal';


const findPlanNameById = (plans: any[], id: string) => plans.find(plan => plan.id === id)?.name || 'N/A';

export default function OrgsTable({ organizations, plans, users }: { organizations: any[], plans: any[], users: any[] }) {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
    const [isCreditsModalOpen, setIsCreditsModalOpen] = useState(false);
    const [selectedOrg, setSelectedOrg] = useState<any | null>(null);


    const handleDelete = async (orgId: string) => {
        if (confirm('Are you sure you want to delete this organization? This action cannot be undone.')) {
            try {
                
                await fetch(`/api/admin/orgs/${orgId}`, { method: 'DELETE' });
                alert('Organization deleted successfully.');
                router.refresh();
                
            } catch (error) {
                alert('Failed to delete organization.');
            }
        }
    };

    const openCreditsModal = (org: any) => {
        setSelectedOrg(org);
        setIsCreditsModalOpen(true);
    };

    const openSetAdminModal = (orgId: string) => {
        setSelectedOrgId(orgId);
        setIsModalOpen(true);
    };

    return (
        <>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Organization Name</th>
                        <th>Current Plan</th>
                        <th>Org Admin</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {organizations.map((org) => (
                        <tr key={org.id}>
                            <td> <Link href={`/dashboard/organizations/${org.id}`} className={styles.nameLink}>
                                {org.name}
                            </Link></td>
                            <td>{findPlanNameById(plans, org.plan_id)}</td>

                            <td>{org.admin_name || <span className={styles.muted}>Not Assigned</span>}</td>

                            <td className={styles.actions}>
                                <button onClick={() => openCreditsModal(org)} className={styles.iconButton} title="Assign Credits">
                                    <CircleDollarSign size={16} />
                                </button>
                                <Link href={`/dashboard/organizations/${org.id}/members`} className={styles.iconButton} title="Manage Members">
                                    <Users size={16} />
                                </Link>
                                <button onClick={() => openSetAdminModal(org.id)} className={styles.iconButton} title="Set Admin">
                                    <UserCog size={16} />
                                </button>
                                <Link href={`/dashboard/organizations/${org.id}/edit`} className={styles.iconButton} title="Edit">
                                    <Pencil size={16} />
                                </Link>
                                <button onClick={() => handleDelete(org.id)} className={`${styles.iconButton} ${styles.deleteButton}`} title="Delete">
                                    <Trash2 size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {selectedOrgId && (
                <SetAdminModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    orgId={selectedOrgId}
                    
                    users={users.filter(u => u.organization_id === selectedOrgId)}
                />
            )}

            {selectedOrg && (
                <AssignCreditsModal
                    isOpen={isCreditsModalOpen}
                    onClose={() => setIsCreditsModalOpen(false)}
                    org={selectedOrg}
                />
            )}
        </>
    );
}