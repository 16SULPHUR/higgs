'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api.client';
import { ArrowLeft, Loader2 } from 'lucide-react'; 
import OrgForm from '@/components/orgs/OrgForm';
import { useSessionContext } from '@/contexts/SessionContext';

export default function EditOrgPage() {
  const params = useParams();
  const session = useSessionContext();

  const orgId = params.id as string | undefined;

  const [data, setData] = useState<{ org: any, plans: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!session || !orgId) {
      // No session or orgId - reset state and stop loading
      setData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const [org, plans] = await Promise.all([
        api(session).get(`/api/admin/orgs/${orgId}`),
        api(session).get('/api/admin/plans')
      ]);
      setData({ org, plans });
    } catch (err: any) {
      setError(err.message || 'Failed to load organization data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session && orgId) {
      fetchData();
    } else {
      // If session or orgId disappears, reset state accordingly
      setData(null);
      setIsLoading(false);
      setError(null);
    }
  }, [session, orgId]);

  if (isLoading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <p>Error: {error}</p>
        <a href="/admin/dashboard/organizations/">
          <ArrowLeft size={16} /> Back to Organizations
        </a>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <p>Organization not found.</p>
        <a href="/admin/dashboard/organizations/">
          <ArrowLeft size={16} /> Back to Organizations
        </a>
      </div>
    );
  }

  return (
    <div>
      <a href="/admin/dashboard/organizations/">
        <ArrowLeft size={16} /> Back to Organizations
      </a>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>
        Edit {data.org.name}
      </h1>
      <OrgForm 
      session={session}
        plans={data.plans} 
        initialData={data.org} 
        onUpdate={fetchData} 
      />
    </div>
  );
}
