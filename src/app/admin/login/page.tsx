import { redirect } from 'next/navigation';
import styles from './LoginPage.module.css';
import { getSession } from '@/lib/session';
import AdminLoginForm from '@/components/auth/AdminLoginForm';

export default async function LoginPage() {
  const session = await getSession();
  if (session) {
    redirect('/dashboard');
  }

  return (
    <main className={styles.container}>
      <AdminLoginForm />
    </main>
  );
}