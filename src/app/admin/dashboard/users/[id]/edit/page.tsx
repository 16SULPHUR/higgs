'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api.client';
import { ArrowLeft, Loader2 } from 'lucide-react';
import CreateUserForm from '@/components/admin/users/CreateUserForm';
import styles from '../../../rooms/RoomsPage.module.css';
import { useSessionContext } from '@/contexts/SessionContext';

export default function EditUserPage() {
    const session = useSessionContext();
    const params = useParams();
    const [data, setData] = useState<{ user: any, organizations: any[] } | null>(null);
    const userId = params.id as string;

    const fetchData = () => {
        Promise.all([
            api(session).get(`/api/admin/users/${userId}`),
            api(session).get('/api/admin/orgs')
        ]).then(([user, organizations]) => setData({ user, organizations }));
    };

    useEffect(() => {
        if (userId) fetchData();
    }, [userId]);

    if (!data) return <div style={{padding: '4rem', textAlign: 'center'}}><Loader2 className="animate-spin"/></div>;

    return (
        <div>
            <div className={styles.header}>
                <div>
                    <a href="/admin/dashboard/users" className={styles.backButton}><ArrowLeft size={16} /><span>Back to Users</span></a>
                    <h1 className={styles.title}>Edit User: {data.user.name}</h1>
                    <p className={styles.description}>Update user details and permissions.</p>
                </div>
            </div>
            <CreateUserForm session={session} organizations={data.organizations} initialData={data.user} onUpdate={fetchData} />
        </div>
    );
}