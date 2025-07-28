'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api.client';
import { ArrowLeft, Loader2 } from 'lucide-react';
import PlanForm from '@/components/plans/PlanForm';
import { useSessionContext } from '@/contexts/SessionContext';

export default function EditPlanPage() {
    const session = useSessionContext();
    const params = useParams();
    const [plan, setPlan] = useState<any>(null);
    const planId = params.id as string;

    const fetchData = () => {
        api.get(session, `/api/admin/plans/${planId}`).then(setPlan);
    };

    useEffect(() => {
        if (planId) fetchData();
    }, [planId]);

    if (!plan) return <div style={{padding: '4rem', textAlign: 'center'}}><Loader2 className="animate-spin"/></div>;

    return (
        <div>
            <a href="/admin/dashboard/plans"><ArrowLeft size={16}/> Back to Plans</a>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '2rem' }}>Edit {plan.name}</h1>
            <PlanForm session={session} initialData={plan} onUpdate={fetchData} />
        </div>
    );
}