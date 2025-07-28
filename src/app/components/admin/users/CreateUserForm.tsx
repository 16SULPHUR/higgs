'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api.client';
import styles from '../../rooms/RoomForm.module.css';

const roles = ['INDIVIDUAL_USER', 'ORG_USER', 'ORG_ADMIN'];

export default function CreateUserForm({ organizations, initialData, onUpdate, session }: { organizations: any[], initialData?: any, onUpdate?: () => void, session:any }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
            if (isEditing) {
                await api.patch(session, `/api/admin/users/${initialData.id}`, formData);
                alert('User updated successfully.');
                if (onUpdate) onUpdate();
            } else {
                const result = await api.post(session, '/api/admin/users', formData);
                alert(result.message || 'User created successfully.');
                router.push('/admin/dashboard/users');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isOrgRole = formData.role.startsWith('ORG_');

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGrid}>
                <div className={styles.inputGroup}><label>Full Name</label><input name="name" value={formData.name} onChange={handleChange} required className={styles.input} disabled={isSubmitting} /></div>
                <div className={styles.inputGroup}><label>Email Address</label><input name="email" type="email" value={formData.email} onChange={handleChange} required className={styles.input} disabled={isSubmitting || isEditing} /></div>
                <div className={styles.inputGroup}><label>Phone Number</label><input name="phone" type="tel" value={formData.phone} onChange={handleChange} className={styles.input} disabled={isSubmitting} /></div>
                <div className={styles.inputGroup}><label>Role</label><select name="role" value={formData.role} onChange={handleChange} required className={styles.input} disabled={isSubmitting}>{roles.map(r => <option key={r} value={r}>{r}</option>)}</select></div>
                {isOrgRole && (<div className={styles.inputGroup}><label>Organization</label><select name="organization_id" value={formData.organization_id} onChange={handleChange} required={isOrgRole} className={styles.input} disabled={isSubmitting}><option value="" disabled>Select an organization...</option>{organizations.map(org => <option key={org.id} value={org.id}>{org.name}</option>)}</select></div>)}
                {isEditing && (<div className={styles.checkboxGroup}><input name="is_active" type="checkbox" checked={formData.is_active} onChange={handleChange} className={styles.checkbox} disabled={isSubmitting} /><label>User is Active</label></div>)}
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.formActions}>
                <button type="button" onClick={() => router.back()} className={`${styles.button} ${styles.secondary}`} disabled={isSubmitting}>Cancel</button>
                <button type="submit" className={styles.button} disabled={isSubmitting}>{isSubmitting ? 'Saving...' : (isEditing ? 'Update User' : 'Create User & Send Invite')}</button>
            </div>
        </form>
    );
}