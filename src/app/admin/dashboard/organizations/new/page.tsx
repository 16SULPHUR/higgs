'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { api } from '@/lib/api.client'; 
import OrgForm from '@/components/orgs/OrgForm';
import { useSessionContext } from '@/contexts/SessionContext';

export default function NewOrgPage() {
  const session = useSessionContext();
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      // No session - clear plans and stop loading
      setPlans([]);
      setIsLoading(false);
      return;
    }

    const fetchPlans = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const plansData = await api.get('/api/admin/plans');
        setPlans(plansData);
      } catch (err: any) {
        setError(err.message || 'Failed to load plans.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, [session]);

  if (isLoading) {
    return (
      <div>
        <a href="/admin/dashboard/organizations" style={{ marginBottom: '1.5rem' }}>
          <ArrowLeft size={16} /> Back to Organizations
        </a>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Create New Organization</h1>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <Loader2 className="animate-spin" />
          <p>Loading plans...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <a href="/admin/dashboard/organizations" style={{ marginBottom: '1.5rem' }}>
          <ArrowLeft size={16} /> Back to Organizations
        </a>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Create New Organization</h1>
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <a href="/admin/dashboard/organizations" style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back to Organizations
      </a>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>
        Create New Organization
      </h1>
      {plans.length > 0 ? (
        <OrgForm session={session} plans={plans} />
      ) : (
        <p>No plans available.</p>
      )}
    </div>
  );
}
