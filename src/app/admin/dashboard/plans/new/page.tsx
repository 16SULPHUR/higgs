import PlanForm from '@/components/plans/PlanForm';

export default function NewPlanPage() {
  return (
    <div>
      <h1 style={{fontSize: '1.75rem', fontWeight: 700, marginBottom: '2rem'}}>Create New Plan</h1>
      <PlanForm />
    </div>
  );
}