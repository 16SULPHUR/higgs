'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { api } from '@/lib/api.client';
import { PlusCircle, Loader2 } from 'lucide-react';
import AdminTicketsTable from '@/components/admin/tickets/AdminTicketsTable';
import TableSkeleton from '@/components/common/TableSkeleton';
import styles from './AdminTicketsPage.module.css';

export default function AdminTicketsPage() {
    const { status } = useSession();
    const [tickets, setTickets] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const data = await api.get('/api/admin/support-tickets');
            setTickets(data);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (status === 'authenticated') {
            fetchData();
        }
    }, [status]);
    
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Support Tickets</h1>
                    <p className={styles.description}>View, manage, and respond to all user support tickets.</p>
                </div>
                <a href="/admin/dashboard/tickets/new" className={styles.newTicketButton}>
                    <PlusCircle size={18} />
                    <span>Create Ticket for User</span>
                </a>
            </div>
            <div className={styles.tableContainer}>
                {isLoading ? <TableSkeleton cols={4} /> : <AdminTicketsTable tickets={tickets} onUpdate={fetchData} />}
            </div>
        </div>
    );
}