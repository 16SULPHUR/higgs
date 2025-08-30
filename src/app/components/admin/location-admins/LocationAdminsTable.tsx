'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api.client';
import { Edit, Trash2, Plus, Eye } from 'lucide-react';
import Link from 'next/link';
import styles from './LocationAdminsTable.module.css';

interface LocationAdmin {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    is_active: boolean;
    created_at: string;
    location_id: string;
    location_name: string;
    location_address: string;
}

export default function LocationAdminsTable({ session }: { session: any }) {
    const [locationAdmins, setLocationAdmins] = useState<LocationAdmin[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchLocationAdmins();
    }, []);

    const fetchLocationAdmins = async () => {
        try {
            setLoading(true);
            const data = await api.get(session, '/api/admin/location-admins');
            setLocationAdmins(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this location admin?')) {
            return;
        }

        try {
            await api.delete(session, `/api/admin/location-admins/${id}`);
            await fetchLocationAdmins();
        } catch (err: any) {
            alert('Failed to delete location admin: ' + err.message);
        }
    };

    const toggleActiveStatus = async (id: string, currentStatus: boolean) => {
        try {
            const admin = locationAdmins.find(la => la.id === id);
            if (!admin) return;

            await api.patch(session, `/api/admin/location-admins/${id}`, {
                ...admin,
                is_active: !currentStatus
            });
            await fetchLocationAdmins();
        } catch (err: any) {
            alert('Failed to update status: ' + err.message);
        }
    };

    if (loading) return <div className={styles.loading}>Loading location admins...</div>;
    if (error) return <div className={styles.error}>Error: {error}</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}> 
                <Link href="/admin/dashboard/location-admins/new" className={styles.addButton}>
                    <Plus size={16} />
                    Add Location Admin
                </Link>
            </div>

            {locationAdmins.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>No location admins found.</p>
                    <Link href="/admin/dashboard/location-admins/new" className={styles.addButton}>
                        <Plus size={16} />
                        Create First Location Admin
                    </Link>
                </div>
            ) : (
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Location</th>
                                <th>Status</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {locationAdmins.map((admin) => (
                                <tr key={admin.id}>
                                    <td>{admin.name}</td>
                                    <td>{admin.email}</td>
                                    <td>{admin.phone || '-'}</td>
                                    <td>
                                        <div className={styles.locationInfo}>
                                            <strong>{admin.location_name}</strong>
                                            {admin.location_address && (
                                                <span
                                                    className={styles.address}
                                                    style={{
                                                        display: 'inline-block',
                                                        maxWidth: '220px',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                    }}
                                                >
                                                    {admin.location_address}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => toggleActiveStatus(admin.id, admin.is_active)}
                                            className={`${styles.statusToggle} ${admin.is_active ? styles.active : styles.inactive}`}
                                        >
                                            {admin.is_active ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td>{new Date(admin.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <div className={styles.actions}>
                                            <Link
                                                href={`/admin/dashboard/location-admins/${admin.id}`}
                                                className={styles.actionButton}
                                                title="View Details"
                                            >
                                                <Eye size={16} />
                                            </Link>
                                            <Link
                                                href={`/admin/dashboard/location-admins/${admin.id}/edit`}
                                                className={styles.actionButton}
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(admin.id)}
                                                className={`${styles.actionButton} ${styles.deleteButton}`}
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
