import OrgForm from '@/components/orgs/OrgForm';
import { api } from '@/lib/apiClient';

export default async function NewOrgPage() {
  const plans = await api.get('/api/admin/plans');
  return (
    <div>
      <h1 style={{fontSize: '1.75rem', fontWeight: 700}}>Create New Organization</h1>
      <OrgForm plans={plans} />
    </div>
  );
}