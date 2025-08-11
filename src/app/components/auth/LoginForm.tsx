'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, Loader2 } from 'lucide-react'; // Import Loader2 for the spinner
import { getSession, signIn } from 'next-auth/react';
import styles from './LoginForm.module.css';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); 
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true); 

    try {
      // Preflight check to surface backend error messages (e.g., pending approval, unverified)
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!baseUrl) throw new Error('API not configured');
      const pre = await fetch(`${baseUrl}/api/auth/email-auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!pre.ok) {
        const data = await pre.json().catch(() => ({ message: 'Login failed' }));
        setError(data?.message || 'Login failed');
        return;
      }

      const result = await signIn('credentials', {
        redirect: false,
        email: email,
        password: password,
        userType: "USER",
      });

      if (result?.error) {
        setError('Invalid email or password.');
      } else if (result?.ok) {
        const session: any = await getSession();

        if (session?.accessToken) {
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
              disabled={isLoading}  
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
              disabled={isLoading}  
            />
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

        <div className={styles.divider}>OR</div>

        <button onClick={handleGoogleSignIn} className={`${styles.button} ${styles.googleButton}`} disabled={isLoading}>
          <span>Sign in with Google</span>
        </button>
      </div>

      <div className={styles.cardFooter}>
        <a href="/forgot-password" className={styles.forgotPasswordLink}>
          Forgot Password?
        </a>
      </div>
    </div>      
      
  );
}