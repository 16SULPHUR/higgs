'use client';

import { useState } from 'react';
import { redirect, useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { getSession } from 'next-auth/react';
import styles from './LoginForm.module.css';
import { setCookie } from '@/lib/cookieUtils';

export default function AdminLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
      userType: 'ADMIN',
      callbackUrl: '/admin/dashboard',
    });

    if (result?.error) {
      setError('Invalid email or password.');
    } else if (result?.ok) {
      const session: any = await getSession();

      if (session?.accessToken) {
        setCookie('accessToken', session.accessToken);
      }
      if (session?.refreshToken) {
        setCookie('refreshToken', session.refreshToken);
      }

      if (session?.user?.role) {
        document.cookie = `role=${session.user.role}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax;`;
      }

      if (session?.user?.name) {
        document.cookie = `name=${session.user.name}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax;`;
      }

      if (session?.user?.profile_picture) {
        document.cookie = `profile_picture=${session.user.profile_picture}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax;`;
      }


      redirect('/admin/dashboard');
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h1 className={styles.cardTitle}>Admin Portal</h1>
        <p className={styles.cardDescription}>
          Enter your credentials to access the dashboard.
        </p>
      </div>
      <div className={styles.cardContent}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
              placeholder="admin@higgs.co"
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          {error && <p className={styles.errorText}>{error}</p>}
          <button type="submit" className={styles.button}>
            <LogIn size={16} />
            <span>Sign In</span>
          </button>
        </form>

        <div className={styles.divider}>OR</div>
      </div>
    </div>
  );
}
