// 'use client';

// import { useState, useEffect } from 'react';
// import { useSession } from 'next-auth/react';
// import Link from 'next/link';
// import { ArrowLeft, Loader2 } from 'lucide-react';
// import { api } from '@/lib/api.client';
// import MemberList from '@/components/member-book/MemberList';
// import styles from './MemberBookPage.module.css';

// export default function MemberBookPage() {
//     const { status } = useSession();
//     const [users, setUsers] = useState<any[]>([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         if (status === 'authenticated') {
//             const fetchMembers = async () => {
//                 try {
//                     const data = await api.get(session, '/api/users/member-book');
//                     setUsers(data);
//                 } catch (err: any) {
//                     setError(err.message);
//                 } finally {
//                     setIsLoading(false);
//                 }
//             };
//             fetchMembers();
//         }
//         if (status === 'unauthenticated') {
//             setIsLoading(false);
//         }
//     }, [status]);

//     const renderContent = () => {
//         if (isLoading || status === 'loading') {
//             return <div className={styles.loadingState}><Loader2 className={styles.loaderIcon} /></div>;
//         }
//         if (error) {
//             return <div className={styles.errorState}>Error: {error}</div>;
//         }
//         return <MemberList initialUsers={users} />;
//     };
    
//     return (
//         <div className={styles.container}>
//             <a href="/dashboard" className={styles.backButton}>
//                 <ArrowLeft size={16} />
//                 <span>Back to Dashboard</span>
//             </a>
//             <div className={styles.header}>
//                 <h1 className={styles.title}>Member Directory</h1>
//                 <p className={styles.description}>
//                     Find and connect with other members at Higgs Workspace.
//                 </p>
//             </div>
//             {renderContent()}
//         </div>
//     );
// }





import { ArrowLeft } from 'lucide-react';
import styles from './MemberBookPage.module.css';
import MemberBookClient from './MemberBookClient';

export const revalidate = 300;

async function fetchMemberNames() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL as string;
  const res = await fetch(`${baseUrl}/api/public/users/member-names`, { next: { revalidate: 300 } });
  if (!res.ok) return [] as { id: string; name: string }[];
  const data = await res.json();
  return (Array.isArray(data) ? data : []).map((u: any) => ({ id: u.id, name: u.name }));
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
