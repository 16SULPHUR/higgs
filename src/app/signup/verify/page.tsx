'use client';

import { useEffect, useState } from 'react';
// import { signIn } from 'next-auth/react';
import styles from './VerifySignupPage.module.css';

export default function VerifySignupPage() {
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
      const params = new URLSearchParams({ notice: 'verified' });
      window.location.href = `/login?${params.toString()}`;
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

