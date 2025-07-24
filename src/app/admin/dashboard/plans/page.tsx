'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { api } from '@/lib/api.client';
import { Plus, Loader2 } from 'lucide-react'; 
import TableSkeleton from '@/components/common/TableSkeleton';
import styles from '@/admin/dashboard/rooms/RoomsPage.module.css';
import PlansTable from '@/components/plans/PlansTable';

export default function PlansPage() {
    const { status } = useSession();
    const [plans, setPlans] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const data = await api.get('/api/admin/plans');
            setPlans(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (status === 'authenticated') {
            fetchData();
        }
    }, [status]);

    const renderContent = () => {
        if (isLoading || status === 'loading') {
            return <div className={styles.tableContainer}><TableSkeleton cols={4} /></div>;
        }
        if (error) {
            return <p>Error: {error}</p>;
        }
        return <div className={styles.tableContainer}><PlansTable plans={plans} onUpdate={fetchData} /></div>;
    };

    return (
        <div>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Subscription Plans</h1>
                    <p className={styles.description}>Create and manage pricing plans for organizations.</p>
                </div>
                <a href="/admin/dashboard/plans/new" className={styles.addButton}>
                    <Plus size={16} />
                    <span>Add New Plan</span>
                </a>
            </div>
            {renderContent()}
        </div>
    );
}