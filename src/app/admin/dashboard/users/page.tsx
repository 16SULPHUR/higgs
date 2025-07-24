'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { api } from '@/lib/api.client';
import { Plus, Loader2 } from 'lucide-react';
import UsersTable from '@/components/admin/users/UsersTable';
import TableSkeleton from '@/components/common/TableSkeleton';
import styles from './AdminUsersPage.module.css';

export default function AdminUsersPage() {
    const { status } = useSession();
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const data = await api.get('/api/admin/users');
            setUsers(data);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (status === 'authenticated') {
            fetchData();
        }
    }, [status]);

    return (
        <div>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Manage Users</h1>
                    <p className={styles.description}>View, edit, and manage all user accounts.</p>
                </div>
                <a href="/admin/dashboard/users/new" className={styles.addButton}><Plus size={16} /><span>Add New User</span></a>
            </div>
            <div className={styles.tableContainer}>
                {isLoading ? <TableSkeleton cols={5} /> : <UsersTable users={users} onUpdate={fetchData} />}
            </div>
        </div>
    );
}