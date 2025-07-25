'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react'; 
import PlanForm from '@/components/plans/PlanForm';
import { useSessionContext } from '@/contexts/SessionContext';

export default function NewPlanPage() {
  const session = useSessionContext();
  return (
    <div>
      <a href="/admin/dashboard/plans" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem'}}>
        <ArrowLeft size={16} /> Back to Plans
      </a>
      <h1 style={{fontSize: '1.75rem', fontWeight: 700, marginBottom: '2rem'}}>Create New Plan</h1>
      <PlanForm session={session}  />
    </div>
  );
}