'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api.client';
import { ArrowLeft, Loader2 } from 'lucide-react'; 
import OrgForm from '@/components/orgs/OrgForm';

export default function EditOrgPage() {
    const params = useParams();
    const [data, setData] = useState<{ org: any, plans: any[] } | null>(null);
    const orgId = params.id as string;

    const fetchData = () => {
        Promise.all([
            api.get(`/api/admin/orgs/${orgId}`),
            api.get('/api/admin/plans')
        ]).then(([org, plans]) => setData({ org, plans }));
    };

    useEffect(() => {
        if (orgId) fetchData();
    }, [orgId]);

    if (!data) return <div style={{padding: '4rem', textAlign: 'center'}}><Loader2 className="animate-spin"/></div>;

    return (
        <div>
            <a href={`/admin/dashboard/organizations/`}><ArrowLeft size={16}/> Back to Organizations</a>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Edit {data.org.name}</h1>
            <OrgForm plans={data.plans} initialData={data.org} onUpdate={fetchData} />
        </div>
    );
}