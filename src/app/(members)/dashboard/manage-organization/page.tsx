import { api } from '@/lib/apiClient';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import OrgProfileForm from '@/components/orgs/OrgProfileForm';
import styles from '../profile/ProfilePage.module.css';

export default async function ManageOrganizationPage() {
  const orgData = await api.get('/api/orgs/profile', ['org-profile']);

  return (
    <div className={styles.container}>
      <a href="/dashboard" className={styles.backButton}>
        <ArrowLeft size={16} />
        <span>Back to Dashboard</span>
      </a>
      <h1 className={styles.title}>Manage Organization</h1>
      <p className={styles.description}>
        Update your organization's details and logo.
      </p>
      <div className={styles.formContainer}>
        <OrgProfileForm initialData={orgData} />
      </div>
    </div>
  );
}