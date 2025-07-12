'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import styles from '../../rooms/RoomForm.module.css';
import { createUserByAdminAction, saveUserByAdminAction } from '@/actions/adminUsersActions';

const roles = ['INDIVIDUAL_USER', 'ORG_USER', 'ORG_ADMIN'];

export default function CreateUserForm({ organizations, initialData }: { organizations: any[], initialData?: any }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', role: 'INDIVIDUAL_USER', organization_id: '', is_active: true });

    const isEditing = !!initialData?.id;

    useEffect(() => {
        if (isEditing) {
            setFormData({
                name: initialData.name || '',
                email: initialData.email || '',
                phone: initialData.phone || '',
                role: initialData.role || 'INDIVIDUAL_USER',
                organization_id: initialData.organization_id || '',
                is_active: initialData.is_active ?? true,
            });
        }
    }, [initialData, isEditing]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        startTransition(async () => {
            const result = isEditing ? await saveUserByAdminAction(initialData.id, formData) : await createUserByAdminAction(formData);
            if (result.success) {
                alert(result.message);
                router.push('/admin/dashboard/users');
            } else {
                setError(result.message);
            }
        });
    };

    const isOrgRole = formData.role.startsWith('ORG_');

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGrid}>
                <div className={styles.inputGroup}><label>Full Name</label><input name="name" value={formData.name} onChange={handleChange} required className={styles.input} disabled={isPending} /></div>
                <div className={styles.inputGroup}><label>Email Address</label><input name="email" type="email" value={formData.email} onChange={handleChange} required className={styles.input} disabled={isPending || isEditing} /></div>
                <div className={styles.inputGroup}><label>Phone Number</label><input name="phone" type="tel" value={formData.phone} onChange={handleChange} className={styles.input} disabled={isPending} /></div>
                <div className={styles.inputGroup}><label>Role</label><select name="role" value={formData.role} onChange={handleChange} required className={styles.input} disabled={isPending}>{roles.map(r => <option key={r} value={r}>{r}</option>)}</select></div>
                {isOrgRole && (
                    <div className={styles.inputGroup}><label>Organization</label><select name="organization_id" value={formData.organization_id} onChange={handleChange} required={isOrgRole} className={styles.input} disabled={isPending}><option value="" disabled>Select an organization...</option>{organizations.map(org => <option key={org.id} value={org.id}>{org.name}</option>)}</select></div>
                )}
                {isEditing && (
                    <div className={styles.checkboxGroup}><input name="is_active" type="checkbox" checked={formData.is_active} onChange={handleChange} className={styles.checkbox} disabled={isPending} /><label>User is Active</label></div>
                )}
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.formActions}>
                <button type="button" onClick={() => router.back()} className={`${styles.button} ${styles.secondary}`} disabled={isPending}>Cancel</button>
                <button type="submit" className={styles.button} disabled={isPending}>{isPending ? 'Saving...' : (isEditing ? 'Update User' : 'Create User & Send Invite')}</button>
            </div>
        </form>
    );
}