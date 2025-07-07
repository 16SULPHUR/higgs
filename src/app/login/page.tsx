import LoginForm from '../components/auth/LoginForm';
import { getSession } from '../lib/session';
import { redirect } from 'next/navigation';
import styles from './LoginPage.module.css';

export default async function LoginPage() {
  const session = await getSession();
  if (session) {
    redirect('/dashboard');
  }

  return (
    <main className={styles.container}>
      <LoginForm />
    </main>
  );
}