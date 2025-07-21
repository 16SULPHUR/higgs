'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Pencil, Trash2, User, UserCheck, UserX } from 'lucide-react';
 
import styles from '../../rooms/RoomsTable.module.css';
import { deleteUserAction, toggleUserStatusAction } from '@/actions/adminUsersActions';

export default function UsersTable({ users }: { users: any[] }) {
    const [isPending, startTransition] = useTransition();

    const handleToggleStatus = (user: any) => {
        const action = user.is_active ? 'deactivate' : 'activate';
        if (confirm(`Are you sure you want to ${action} the user "${user.name}"?`)) {
            startTransition(() => {
                toggleUserStatusAction(user.id, user.is_active);
            });
        }
    };

    const handleDelete = (user: any) => {
        if (confirm(`This will permanently delete the user "${user.name}" and all their data. This action cannot be undone. Proceed?`)) {
            startTransition(() => {
                deleteUserAction(user.id);
            });
        }
    };

    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Organization</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                {user.profile_picture ? (
                                    <Image src={user.profile_picture} alt={user.name} width={32} height={32} style={{ borderRadius: '50%' }} />
                                ) : (
                                    <span className={styles.avatarFallback}><User size={16} /></span>
                                )}
                                <div>
                                    <div style={{ fontWeight: 500 }}>{user.name}</div>
                                    <div className={styles.subtext}>{user.email}</div>
                                </div>
                            </div>
                        </td>
                        <td>{user.organization_name || <span className={styles.muted}>N/A</span>}</td>
                        <td>{user.role}</td>
                        <td><span className={user.is_active ? styles.active : styles.inactive}>{user.is_active ? 'Active' : 'Inactive'}</span></td>
                        <td className={styles.actions}>
                            <button onClick={() => handleToggleStatus(user)} className={styles.iconButton} title={user.is_active ? 'Deactivate' : 'Activate'} disabled={isPending}>
                                {user.is_active ? <UserX size={16} /> : <UserCheck size={16} />}
                            </button>
                            <a href={`/admin/dashboard/users/${user.id}/edit`} className={styles.iconButton} title="Edit User"><Pencil size={16} /></a>
                            <button onClick={() => handleDelete(user)} className={`${styles.iconButton} ${styles.deleteButton}`} title="Delete User" disabled={isPending}><Trash2 size={16} /></button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}