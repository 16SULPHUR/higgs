import { ArrowLeft } from 'lucide-react';
import styles from './MemberBookPage.module.css';
import MemberBookClient from './MemberBookClient';

export const revalidate = 300;

async function fetchMemberNames() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL as string;
  const res = await fetch(`${baseUrl}/api/public/users/member-book`
    ,{ next: { revalidate: 300 } }
  );
  if (!res.ok) return [] as { id: string; name: string }[];
  const data = await res.json();
  return (Array.isArray(data) ? data : []).map((u: any) => ({ id: u.id, name: u.name, organization_name: u.organization_name }));
}

export default async function MemberBookPage() {
  const initialUsers = await fetchMemberNames();
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

      <MemberBookClient initialUsers={initialUsers} />
    </div>
  );
}
