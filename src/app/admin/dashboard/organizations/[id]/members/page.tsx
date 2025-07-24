'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { api } from '@/lib/api.client';
import { ArrowLeft, Loader2 } from 'lucide-react'; 
import styles from './ManageMembers.module.css';
import AddMemberForm from '@/components/orgs/AddMemberForm';
import CurrentMembersList from '@/components/orgs/CurrentMembersList';

export default function ManageMembersPage() {
    const params = useParams();
    const { status } = useSession();
    const [org, setOrg] = useState<any>(null);
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const orgId = params.id as string;

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [orgData, usersData] = await Promise.all([
                api.get(`/api/admin/orgs/${orgId}`),
                api.get('/api/admin/users/summary')
            ]);
            setOrg(orgData);
            setAllUsers(usersData);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (status === 'authenticated' && orgId) {
            fetchData();
        }
    }, [status, orgId]);

    if (isLoading || status === 'loading') {
        return <div className={styles.loadingState}><Loader2 /></div>;
    }
    if (!org) return <p>Organization not found.</p>;

    const currentMembers = allUsers.filter(user => user.organization_id === org.id);
    const availableUsers = allUsers.filter(user => user.organization_id === null);

    return (
        <div>
            <a href={`/admin/dashboard/organizations/`} className={styles.backButton}><ArrowLeft size={16}/> Back to Organizations</a>
            <h1 className={styles.title}>Manage Members for {org.name}</h1>
            <p className={styles.description}>Add or remove users from this organization.</p>
            <div className={styles.grid}>
                <div className={styles.card}><h2 className={styles.cardTitle}>Add User</h2><AddMemberForm orgId={org.id} availableUsers={availableUsers} onUpdate={fetchData} /></div>
                <div className={styles.card}><h2 className={styles.cardTitle}>Current Members ({currentMembers.length})</h2><CurrentMembersList members={currentMembers} onUpdate={fetchData} /></div>
            </div>
        </div>
    );
}