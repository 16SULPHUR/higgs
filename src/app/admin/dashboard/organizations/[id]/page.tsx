'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api.client';
import { ArrowLeft, Building2, ShieldCheck, Star, Wallet, Loader2 } from 'lucide-react';
import styles from './OrganizationDetailPage.module.css';
import CancelPlanButton from '@/components/orgs/CancelPlanButton';
import { useSessionContext } from '@/contexts/SessionContext';

export default function OrganizationDetailPage() {
  const params = useParams();
  const session = useSessionContext();

  const orgId = params.id as string | undefined;

  const [org, setOrg] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!session || !orgId) {
      // No session or orgId - reset state and stop loading
      setOrg(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get(session, `/api/admin/orgs/${orgId}`);
      setOrg(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load organization details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session && orgId) {
      fetchData();
    } else {
      // If session or orgId disappears, reset state accordingly
      setOrg(null);
      setIsLoading(false);
      setError(null);
    }
  }, [session, orgId]);

  if (isLoading) {
    return (
      <div className={styles.loadingState}>
        <Loader2 className={styles.loaderIcon} />
      </div>
    );
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
        <a href="/admin/dashboard/organizations" className={styles.backButton}>
          <ArrowLeft size={16} />
          <span>Back to Organizations</span>
        </a>
        {hasPlan && (
          <CancelPlanButton session={session} orgId={org.id} orgName={org.name} onUpdate={fetchData} />
        )}
      </div>
      <div className={styles.titleSection}>
        <div className={styles.iconWrapper}>
          <Building2 size={32} />
        </div>
        <div>
          <h1 className={styles.orgName}>{org.name}</h1>
          <p className={styles.orgId}>ID: {org.id}</p>
        </div>
      </div>
      <div className={styles.detailsGrid}>
        <div className={styles.detailCard}>
          <h2 className={styles.cardTitle}>Current Plan</h2>
          <div className={styles.cardContent}>
            <Star className={styles.cardIcon} size={24} />
            {hasPlan ? (
              <span className={styles.planValue}>{org.plan_name}</span>
            ) : (
              <span className={styles.mutedText}>No Active Plan</span>
            )}
          </div>
        </div>
        <div className={styles.detailCard}>
          <h2 className={styles.cardTitle}>Credit Pool</h2>
          <div className={styles.cardContent}>
            <Wallet className={styles.cardIcon} size={24} />
            <span className={styles.detailValue}>{org.credits_pool ?? 0}</span>
          </div>
        </div>
        <div className={styles.detailCard}>
          <h2 className={styles.cardTitle}>Organization Admin</h2>
          <div className={styles.cardContent}>
            <ShieldCheck className={styles.cardIcon} size={24} />
            {org.admin_name ? (
              <div>
                <span className={styles.detailValue}>{org.admin_name}</span>
                <p className={styles.mutedText}>{org.admin_email}</p>
              </div>
            ) : (
              <span className={styles.mutedText}>Not Assigned</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
