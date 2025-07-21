import LoginForm from '../components/auth/LoginForm';
import { getSession } from '../lib/session';
import { redirect } from 'next/navigation';
import styles from './LoginPage.module.css';
import Link from 'next/link';

export default async function LoginPage() {
  const session = await getSession();
  if (session) {
    redirect('/dashboard');
  }

  return (
    <main className={styles.container}>
      <a href='/admin/login' >Admin Login</a>
      <LoginForm />
    </main>
  );
}