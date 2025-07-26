'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api.client';
import CreateTicketForUserForm from '@/components/admin/tickets/CreateTicketForUserForm';
import styles from '../AdminTicketsPage.module.css';
import { useSessionContext } from '@/contexts/SessionContext';

export default function NewTicketForUserPage() {
    const session = useSessionContext();
    const [users, setUsers] = useState([]);
    useEffect(() => {
        api.get('/api/admin/users').then(setUsers);
    }, []);

    return (
        <div>
            <div className={styles.header}>
                <div>
                    <a href="/admin/dashboard/tickets" className={styles.backButton}><ArrowLeft size={16} /><span>Back to All Tickets</span></a>
                    <h1 className={styles.title}>Create Ticket for User</h1>
                    <p className={styles.description}>Open a new support ticket on behalf of a specific user.</p>
                </div>
            </div>
            {users.length > 0 ? <CreateTicketForUserForm session={session} users={users} /> : <p>Loading users...</p>}
        </div>
    );
}