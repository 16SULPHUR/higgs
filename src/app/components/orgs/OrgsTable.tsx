'use client';

import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api.client';
import { CircleDollarSign, Pencil, Trash2, UserCog, Users, Loader2 } from 'lucide-react';
import SetAdminModal from './SetAdminModal';
import AssignCreditsModal from './AssignCreditsModal';
import styles from '@/components/rooms/RoomsTable.module.css';

const findPlanNameById = (plans: any[], id: string) => plans.find(plan => plan.id === id)?.name || 'N/A';

export default function OrgsTable({ organizations, plans, users, onUpdate, session }: { organizations: any[], plans: any[], users: any[], onUpdate: () => void, session: any }) {
    const [isSetAdminModalOpen, setIsSetAdminModalOpen] = useState(false);
    const [isCreditsModalOpen, setIsCreditsModalOpen] = useState(false);
    const [selectedOrg, setSelectedOrg] = useState<any | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const handleDelete = async (orgId: string, orgName: string) => {
        if (confirm(`Are you sure you want to delete "${orgName}"? This action cannot be undone.`)) {
            setIsDeleting(orgId);
            try {
                await api.delete(session, `/api/admin/orgs/${orgId}`);
                alert('Organization deleted successfully.');
                onUpdate();
            } catch (error: any) {
                alert(`Failed to delete organization: ${error.message}`);
            } finally {
                setIsDeleting(null);
            }
        }
    };

    const openModal = (type: 'admin' | 'credits', org: any) => {
        setSelectedOrg(org);
        if (type === 'admin') setIsSetAdminModalOpen(true);
        if (type === 'credits') setIsCreditsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedOrg(null);
        setIsSetAdminModalOpen(false);
        setIsCreditsModalOpen(false);
    };

    return (
        <>
            <table className={styles.table}>
                <thead>
                    <tr><th>Organization Name</th><th>Current Plan</th><th>Credits</th><th>Org Admin</th><th>Actions</th></tr>
                </thead>
                <tbody>
                    {organizations.map((org) => (
                        <tr key={org.id}>
                            <td><a href={`/admin/dashboard/organizations/${org.id}`} className={styles.nameLink}>{org.name}</a></td>
                            <td>{findPlanNameById(plans, org.plan_id) || <span className={styles.muted}>No Plan</span>}</td>
                            <td>{org.credits_pool}</td>
                            <td>{org.admin_name || <span className={styles.muted}>Not Assigned</span>}</td>
                            <td className={styles.actions}>
                                <button onClick={() => openModal('credits', org)} className={styles.iconButton} title="Assign Credits"><CircleDollarSign size={16} /></button>
                                <a href={`/admin/dashboard/organizations/${org.id}/members`} className={styles.iconButton} title="Manage Members"><Users size={16} /></a>
                                <button onClick={() => openModal('admin', org)} className={styles.iconButton} title="Set Admin"><UserCog size={16} /></button>
                                <a href={`/admin/dashboard/organizations/${org.id}/edit`} className={styles.iconButton} title="Edit"><Pencil size={16} /></a>
                                <button onClick={() => handleDelete(org.id, org.name)} className={`${styles.iconButton} ${styles.deleteButton}`} title="Delete" disabled={!!isDeleting}>
                                    {isDeleting === org.id ? <Loader2 size={16} className={styles.spinner}/> : <Trash2 size={16} />}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {selectedOrg && (
                <>
                    <SetAdminModal session={session} isOpen={isSetAdminModalOpen} onClose={closeModal} orgId={selectedOrg.id} users={users.filter(u => u.organization_id === selectedOrg.id)} onUpdate={onUpdate} />
                    <AssignCreditsModal isOpen={isCreditsModalOpen} onClose={closeModal} org={selectedOrg} onUpdate={onUpdate} session={session} />
                </>
            )}
        </>
    );
}