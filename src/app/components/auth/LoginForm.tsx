'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react'; 
import { signIn, signOut, useSession } from 'next-auth/react';
import styles from './LoginForm.module.css';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    
    const result = await signIn('credentials', {
      redirect: false,
      email: email,
      password: password,
    });

    if (result?.error) {
      
      setError('Invalid email or password.');
    } else if (result?.ok) {
      
      router.push('/dashboard');
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h1 className={styles.cardTitle}>User Portal</h1>
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

        <button onClick={() => signIn('google', { callbackUrl: '/dashboard' })} className={`${styles.button} ${styles.googleButton}`}>
            <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  );
}