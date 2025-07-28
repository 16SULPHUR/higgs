'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api.client';
import { ArrowLeft } from 'lucide-react';
import CreateUserForm from '@/components/admin/users/CreateUserForm';
import styles from '../../rooms/RoomsPage.module.css';
import { useSessionContext } from '@/contexts/SessionContext';

export default function NewUserPage() {
  const session = useSessionContext();
  const [organizations, setOrganizations] = useState([]);
  useEffect(() => {
      api.get(session, '/api/admin/orgs').then(setOrganizations);
  }, []);

  return (
    <div>
      <div className={styles.header}>
        <div>
          <a href="/admin/dashboard/users" className={styles.backButton}><ArrowLeft size={16} /><span>Back to Users</span></a>
          <h1 className={styles.title}>Create New User</h1>
          <p className={styles.description}>Create a user account and send them a welcome email with credentials.</p>
        </div>
      </div>
      {organizations.length > 0 ? <CreateUserForm session={session} organizations={organizations} /> : <p>Loading organizations...</p>}
    </div>
  );
}