'use client';

import { useState } from 'react';
import { redirect, useRouter } from 'next/navigation';
import { LogIn, Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { getSession } from 'next-auth/react';
import styles from './LoginForm.module.css';
import { setCookie } from '@/lib/cookieUtils';

export default function AdminLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); 
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

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
    setIsLoading(false);
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        {/* <h2 className={styles.cardTitle}>Admin Portal</h2>
        <p className={styles.cardDescription}>Sign in to manage Higgs Workspace.</p> */}
      </div>
      <div className={styles.cardContent}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <div className={styles.inputWrapper}>
              <Mail size={18} className={styles.icon} />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.input}
                placeholder="admin@higgs.co"
                disabled={isLoading}
                autoComplete="email"
              />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <div className={styles.inputWrapper}>
              <Lock size={18} className={styles.icon} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.input}
                disabled={isLoading}
                autoComplete="current-password"
              />
              <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} className={styles.passwordToggle} onClick={() => setShowPassword((v) => !v)} disabled={isLoading}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div className={styles.actionsRow}>
            <a href="/admin/forgot-password" className={styles.forgotPasswordLink}>Forgot password?</a>
          </div>
          {error && <p className={styles.errorText}>{error}</p>}
          <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 size={16} className={styles.spinner} />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <LogIn size={16} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
