'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { getSession, signIn } from 'next-auth/react';
import { useSessionActions } from '@/contexts/SessionContext';
import styles from './LoginForm.module.css';

type LoginFormProps = {
  variant?: 'default' | 'full';
};

export default function LoginForm({ variant = 'default' }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { refreshSession } = useSessionActions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true); 

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: email,
        password: password,
        userType: "USER",
      });

      if (result?.error) {
        setError('Invalid email or password.');
      } else if (result?.ok) {
        console.log('SignIn result:', result);
        
        const session: any = await getSession();
        
        console.log('Session data:', session);
        console.log('Session accessToken:', session?.accessToken);
        console.log('Session refreshToken:', session?.refreshToken);
        
        // Try to get tokens from result first, then from session
        const accessToken = (result as any)?.accessToken || session?.accessToken;
        const refreshToken = (result as any)?.refreshToken || session?.refreshToken;
        
        console.log('Final accessToken:', accessToken);
        console.log('Final refreshToken:', refreshToken);

        if (accessToken) {
          document.cookie = `accessToken=${accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax;`;
          console.log('Set accessToken cookie');
        }

        if (refreshToken) {
          document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax;`;
          console.log('Set refreshToken cookie');
        }

        if (session?.user?.role) {
          document.cookie = `role=${session.user.role}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax;`;
          console.log('Set role cookie:', session.user.role);
        }

        if (session?.user?.name) {
          document.cookie = `name=${session.user.name}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax;`;
          console.log('Set name cookie:', session.user.name);
        }

        if (session?.user?.profile_picture) {
          document.cookie = `profile_picture=${session.user.profile_picture}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax;`;
          console.log('Set profile_picture cookie');
        }
        
        // Verify cookies were set
        console.log('All cookies after setting:', document.cookie);

        // Ensure the app-level session provider picks up the fresh cookies
        try { await refreshSession(); } catch {}
        router.push('/dashboard');
      }
    } catch (err: any) {
      const message = err?.message || 'An unexpected error occurred. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);  
    }
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    signIn('google', { callbackUrl: '/dashboard' });
  };


  const form = (
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
            placeholder="you@company.com"
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
          <button
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className={styles.passwordToggle}
            onClick={() => setShowPassword((v) => !v)}
            disabled={isLoading}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <div className={styles.actionsRow}>
        <a href="/forgot-password" className={styles.forgotPasswordLink}>Forgot password?</a>
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
  );

  if (variant === 'full') {
    return form;
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Sign in to your account</h2>
        <p className={styles.cardDescription}>Access your workspace dashboard.</p>
      </div>
      <div className={styles.cardContent}>
        {form}
      </div>
    </div>
  );
}