import PlanForm from '@/components/plans/PlanForm';
import { api } from '@/lib/apiClient';

export default async function EditPlanPage({ params }: { params: { id: string } }) {
  const plan = await api.get(`/api/admin/plans/${params.id}`);

  return (
    <div>
      <h1 style={{fontSize: '1.75rem', fontWeight: 700, marginBottom: '2rem'}}>Edit {plan.name}</h1>
      <PlanForm initialData={plan} />
    </div>
  );
}