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
//                     const data = await api.get('/api/users/member-book');
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





'use client';

import { useState, useEffect } from 'react';
import { useSessionContext } from '@/contexts/SessionContext';
import { api } from '@/lib/api.client'; // make sure import matches your actual file name
import MemberList from '@/components/member-book/MemberList';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import styles from './MemberBookPage.module.css';
import TableSkeleton from '@/components/common/TableSkeleton';

export default function MemberBookPage() {
  const session = useSessionContext();

  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      // No session, clear users and set loading false
      setUsers([]);
      setIsLoading(false);
      return;
    }

    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const usersData = await api.get('/api/users/member-book');
        setUsers(usersData ?? []);
      } catch (err: any) {
        setError(err.message || 'Failed to load users.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [session]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <TableSkeleton rows={10} cols={4}/>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Link href="/dashboard" className={styles.backButton}>
        <ArrowLeft size={16} />
        <span>Back to Dashboard</span>
      </Link>

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
