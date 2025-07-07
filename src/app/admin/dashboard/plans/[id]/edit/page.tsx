import PlanForm from '@/components/plans/PlanForm';
import { api } from '@/lib/apiClient';
import { use } from 'react';

export default async function EditPlanPage({params}: {params: Promise<{ id: string }>}) {

  const { id } = use(params);

  const plan = await api.get(`/api/admin/plans/${id}`);

  return (
    <div>
      <h1 style={{fontSize: '1.75rem', fontWeight: 700, marginBottom: '2rem'}}>Edit {plan.name}</h1>
      <PlanForm initialData={plan} />
    </div>
  );
}