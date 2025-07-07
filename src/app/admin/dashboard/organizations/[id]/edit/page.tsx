import OrgForm from '@/components/orgs/OrgForm';
import { api } from '@/lib/apiClient';

export default async function EditOrgPage({ params }: { params: { id: string } }) {
  const [org, plans] = await Promise.all([
    api.get(`/api/admin/orgs/${params.id}`), // NOTE: You need a GET /orgs/:id endpoint
    api.get('/api/admin/plans')
  ]);

  return (
    <div>
      <h1 style={{fontSize: '1.75rem', fontWeight: 700}}>Edit {org.name}</h1>
      <OrgForm plans={plans} initialData={org} />
    </div>
  );
}