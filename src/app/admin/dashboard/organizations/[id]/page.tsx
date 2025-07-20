import Link from 'next/link';
import { ArrowLeft, Building2, ShieldCheck, Star, Wallet } from 'lucide-react';
import { api } from '@/lib/apiClient';
import styles from './OrganizationDetailPage.module.css';
import CancelPlanButton from '@/components/orgs/CancelPlanButton';

interface OrgDetailPageProps {
  params: { 
    id: string; 
  };
}

export default async function OrganizationDetailPage({ params }: OrgDetailPageProps) {
  const { id } = params;
  const org = await api.get(`/api/admin/orgs/${id}`, [`org-detail-${id}`]);
  const hasPlan = !!org.plan_name;

  return (
    <div>
      <div className={styles.header}>
        <Link href="/admin/dashboard/organizations" className={styles.backButton}>
          <ArrowLeft size={16} />
          <span>Back to Organizations</span>
        </Link>
        {hasPlan && (
          <CancelPlanButton orgId={org.id} orgName={org.name} />
        )}
      </div>

      <div className={styles.titleSection}>
        <div className={styles.iconWrapper}><Building2 size={32} /></div>
        <div>
            <h1 className={styles.orgName}>{org.name}</h1>
            <p className={styles.orgId}>ID: {org.id}</p>
        </div>
      </div>
      
      <div className={styles.detailsGrid}>
        <div className={styles.detailCard}>
          <h2 className={styles.cardTitle}>Current Plan</h2>
          <div className={styles.cardContent}>
            <Star className={styles.cardIcon} size={24}/>
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
            <Wallet className={styles.cardIcon} size={24}/>
            <span className={styles.detailValue}>{org.credits_pool ?? 0}</span>
          </div>
        </div>
        <div className={styles.detailCard}>
          <h2 className={styles.cardTitle}>Organization Admin</h2>
          <div className={styles.cardContent}>
            <ShieldCheck className={styles.cardIcon} size={24}/>
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