'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api.client'; 
import OrgForm from '@/components/orgs/OrgForm';

export default function NewOrgPage() {
    const [plans, setPlans] = useState([]);
    useEffect(() => {
        api.get('/api/admin/plans').then(setPlans);
    }, []);

    return (
        <div>
            <a href="/admin/dashboard/organizations" style={{marginBottom: '1.5rem'}}><ArrowLeft size={16} /> Back to Organizations</a>
            <h1 style={{fontSize: '1.75rem', fontWeight: 700}}>Create New Organization</h1>
            {plans.length > 0 ? <OrgForm plans={plans} /> : <p>Loading plans...</p>}
        </div>
    );
}