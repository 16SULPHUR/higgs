'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { api } from '@/lib/api.client';
import { ArrowLeft, Building2, ShieldCheck, Star, Wallet, Loader2 } from 'lucide-react';
import styles from './OrganizationDetailPage.module.css';
import CancelPlanButton from '@/components/orgs/CancelPlanButton';

export default function OrganizationDetailPage() {
    const params = useParams();
    const { status } = useSession();
    const [org, setOrg] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const orgId = params.id as string;

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const data = await api.get(`/api/admin/orgs/${orgId}`);
            setOrg(data);
        } catch (err: any) {
            setError(err.message);
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
        return <div className={styles.loadingState}><Loader2 className={styles.loaderIcon} /></div>;
    }
    if (error) {
        return <p>Error: {error}</p>;
    }
    if (!org) {
        return <p>Organization not found.</p>;
    }

    const hasPlan = !!org.plan_name;

    return (
        <div>
            <div className={styles.header}>
                <a href="/admin/dashboard/organizations" className={styles.backButton}><ArrowLeft size={16} /><span>Back to Organizations</span></a>
                {hasPlan && <CancelPlanButton orgId={org.id} orgName={org.name} onUpdate={fetchData} />}
            </div>
            <div className={styles.titleSection}><div className={styles.iconWrapper}><Building2 size={32} /></div><div><h1 className={styles.orgName}>{org.name}</h1><p className={styles.orgId}>ID: {org.id}</p></div></div>
            <div className={styles.detailsGrid}>
                <div className={styles.detailCard}><h2 className={styles.cardTitle}>Current Plan</h2><div className={styles.cardContent}><Star className={styles.cardIcon} size={24}/>{hasPlan ? (<span className={styles.planValue}>{org.plan_name}</span>) : (<span className={styles.mutedText}>No Active Plan</span>)}</div></div>
                <div className={styles.detailCard}><h2 className={styles.cardTitle}>Credit Pool</h2><div className={styles.cardContent}><Wallet className={styles.cardIcon} size={24}/><span className={styles.detailValue}>{org.credits_pool ?? 0}</span></div></div>
                <div className={styles.detailCard}><h2 className={styles.cardTitle}>Organization Admin</h2><div className={styles.cardContent}><ShieldCheck className={styles.cardIcon} size={24}/>{org.admin_name ? (<div><span className={styles.detailValue}>{org.admin_name}</span><p className={styles.mutedText}>{org.admin_email}</p></div>) : (<span className={styles.mutedText}>Not Assigned</span>)}</div></div>
            </div>
        </div>
    );
}