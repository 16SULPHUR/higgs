'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api.client';
import { Pencil, Trash2, User, UserCheck, UserX, Loader2, PlusCircle } from 'lucide-react';
import styles from '../../rooms/RoomsTable.module.css';

export default function UsersTable({ users, onUpdate, session, onGiveCredits }: { users: any[], onUpdate: () => void, session:any, onGiveCredits?: (userId: string) => void }) {
    const [isProcessing, setIsProcessing] = useState<string | null>(null);

    const handleToggleStatus = async (user: any) => {
        const action = user.is_active ? 'deactivate' : 'activate';
        if (confirm(`Are you sure you want to ${action} the user "${user.name}"?`)) {
            setIsProcessing(user.id);
            try {
                await api.patch(session, `/api/admin/users/${user.id}`, { is_active: !user.is_active });
                onUpdate();
            } catch (err: any) {
                alert(`Error: ${err.message}`);
            } finally {
                setIsProcessing(null);
            }
        }
    };

    const handleDelete = async (user: any) => {
        if (confirm(`This will permanently delete "${user.name}". This action cannot be undone. Proceed?`)) {
            setIsProcessing(user.id);
            try {
                await api.delete(session, `/api/admin/users/${user.id}`);
                alert('User deleted successfully.');
                onUpdate();
            } catch (err: any) {
                alert(`Error: ${err.message}`);
            } finally {
                setIsProcessing(null);
            }
        }
    };

    return (
        <table className={styles.table}>
            <thead><tr><th>Name</th><th>Profession</th><th>Organization</th><th>Role</th><th>Credits</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td><div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>{user.profile_picture ? (<Image src={user.profile_picture} alt={user.name} width={32} height={32} style={{ borderRadius: '50%' }} />) : (<span className={styles.avatarFallback}><User size={16} /></span>)}<div><div style={{ fontWeight: 500 }}>{user.name}</div><div className={styles.subtext}>{user.email}</div></div></div></td>
                        <td>{user.profession || <span className={styles.muted}>N/A</span>}</td>
                        <td>{user.organization_name || <span className={styles.muted}>N/A</span>}</td>
                        <td>{user.role}</td>
                        <td>{user.role === 'INDIVIDUAL_USER' ? (typeof user.individual_credits === 'number' ? user.individual_credits : 0) : <span className={styles.muted}>—</span>}</td>
                        <td><span className={user.is_active ? styles.active : styles.inactive}>{user.is_active ? 'Active' : 'Inactive'}</span></td>
                        <td className={styles.actions}>
                            <button onClick={() => handleToggleStatus(user)} className={styles.iconButton} title={user.is_active ? 'Deactivate' : 'Activate'} disabled={!!isProcessing}>{isProcessing === user.id ? <Loader2 size={16} className={styles.spinner} /> : (user.is_active ? <UserX size={16} /> : <UserCheck size={16} />)}</button>
                            <a href={`/admin/dashboard/users/${user.id}/edit`} className={styles.iconButton} title="Edit User"><Pencil size={16} /></a>
                            <button onClick={() => handleDelete(user)} className={`${styles.iconButton} ${styles.deleteButton}`} title="Delete User" disabled={!!isProcessing}>{isProcessing === user.id ? <Loader2 size={16} className={styles.spinner} /> : <Trash2 size={16} />}</button>
                            {(() => {
                              const isOrgMember = Boolean(user.organization_name);
                              const canGiveCredits = Boolean(onGiveCredits) && user.is_active && !isOrgMember;
                              if (!canGiveCredits) return null;
                              return (
                                <button onClick={() => onGiveCredits && onGiveCredits(user.id)} className={styles.iconButton} title="Give Credits" disabled={!!isProcessing}><PlusCircle size={16} /></button>
                              );
                            })()}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}