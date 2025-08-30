'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, signIn } from 'next-auth/react';
import styles from './VerifySignupPage.module.css';

export default function VerifySignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const preset = params.get('email') || '';
      setEmail(preset);
    } catch {}
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !otp || !password) {
      setError('Please fill all fields.');
      return;
    }
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${baseUrl}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Verification failed');

      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        userType: 'USER',
      });

      if (result?.error) {
        throw new Error('Auto-login failed. Please sign in manually.');
      }

      const session: any = await getSession();
      if (session?.session?.accessToken) {
        document.cookie = `accessToken=${session.accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax;`;
      }
      if (session?.refreshToken) {
        document.cookie = `refreshToken=${session.refreshToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax;`;
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

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h1 className={styles.title}>Verify your email</h1>
        </div>
        <div className={styles.cardContent}>
          <form onSubmit={onSubmit} className={styles.form}>
            <input className={styles.input} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className={styles.input} inputMode="numeric" placeholder="6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
            <input className={styles.input} type="password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {error && <p className={styles.error}>{error}</p>}
            <button className={styles.button} type="submit" disabled={loading}>{loading ? 'Verifying...' : 'Verify & Continue'}</button>
          </form>
        </div>
      </div>
    </main>
  );
}

