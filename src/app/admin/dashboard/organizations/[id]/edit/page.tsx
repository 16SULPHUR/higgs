import OrgForm from '@/components/orgs/OrgForm';
import { api } from '@/lib/apiClient';
import { use } from 'react';

export default async function EditOrgPage({params}: {params: Promise<{ id: string }>}) {

   const { id } = use(params);


  const [org, plans] = await Promise.all([
    api.get(`/api/admin/orgs/${id}`), 
    api.get('/api/admin/plans')
  ]);

  return (
    <div>
      <h1 style={{fontSize: '1.75rem', fontWeight: 700}}>Edit {org.name}</h1>
      <OrgForm plans={plans} initialData={org} />
    </div>
  );
}