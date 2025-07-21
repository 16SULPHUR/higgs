import { api } from '@/lib/apiClient';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import MemberList from '@/components/member-book/MemberList';
import styles from './MemberBookPage.module.css';

export default async function MemberBookPage() {
  const users = await api.get('/api/users/member-book');

  return (
    <div className={styles.container}>
      <a href="/dashboard" className={styles.backButton}>
        <ArrowLeft size={16} />
        <span>Back to Dashboard</span>
      </a>
      <div className={styles.header}>
        <h1 className={styles.title}>Member Directory</h1>
        <p className={styles.description}>
          Find and connect with other members at Higgs Workspace.
        </p>
      </div>
      <MemberList initialUsers={users} />
    </div>
  );
}