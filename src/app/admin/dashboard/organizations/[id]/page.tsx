import { api } from '@/lib/apiClient';
import Link from 'next/link';
import { ArrowLeft, Building2, ShieldCheck, Star, Wallet } from 'lucide-react';
import styles from './OrganizationDetailPage.module.css';
import { use } from 'react';

// export default async function OrganizationDetailPage({params}: {params: Promise<{ id: string }>}) {
export default async function OrganizationDetailPage({params}: {params: { id: string }}) {

  // const { id } = use(params);
  const { id } = params;
  
  const org = await api.get(`/api/admin/orgs/${id}`, [`org-detail-${id}`]);

  return (
    <div>
      <div className={styles.header}>
        <Link href="/admin/dashboard/organizations" className={styles.backButton}>
          <ArrowLeft size={16} />
          <span>Back to Organizations</span>
        </Link>
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
            <Star className={styles.cardIcon} size={24}/>
            <span className={styles.planValue}>{org.plan_name || 'Not Set'}</span>
          </div>
        </div>

        <div className={styles.detailCard}>
          <h2 className={styles.cardTitle}>Credit Pool</h2>
          <div className={styles.cardContent}>
            <Wallet className={styles.cardIcon} size={24}/>
            <span className={styles.detailValue}>{org.credits_pool || 0}</span>
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