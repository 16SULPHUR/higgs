import { api } from '@/lib/apiClient';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import styles from '../../../organizations/[id]/members/ManageMembers.module.css'; 
import { use } from 'react';

export default async function EventRegistrationsPage({params}: {params: Promise<{ id: string }>}) {

  const { id } = use(params);


  const [event, registrations] = await Promise.all([
    api.get(`/api/admin/events/${id}`),
    api.get(`/api/admin/events/${id}/registrations`)
  ]);

  return (
    <div>
       <Link href="/admin/dashboard/events" className={styles.backButton} style={{marginBottom: '1.5rem', display: 'inline-flex'}}>
          <ArrowLeft size={16} />
          <span>Back to Events</span>
        </Link>
      <h1 className={styles.title}>Registrations for "{event.title}"</h1>
      <p className={styles.description}>A total of {registrations.length} users have registered for this event.</p>
      
      <div className={styles.card} style={{maxWidth: '800px'}}>
        <ul className={styles.memberList}>
            {registrations.length > 0 ? (
                registrations.map((reg: any) => (
                    <li key={reg.id} className={styles.memberItem}>
                        <span>{reg.name}</span>
                        <span className={styles.memberEmail}>{reg.email}</span>
                    </li>
                ))
            ) : (
                <p className={styles.noMembers}>There are no registrations for this event yet.</p>
            )}
        </ul>
      </div>
    </div>
  );
}