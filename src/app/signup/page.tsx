'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import styles from './SignupPage.module.css';
import Image from 'next/image';

type Location = { id: string; name: string };

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [locationId, setLocationId] = useState('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    fetch(`${baseUrl}/api/public/locations`)
      .then((r) => r.json())
      .then((data) => setLocations(data))
      .catch(() => setLocations([]));
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name || !email || !phone || !password || !confirmPassword || !locationId) {
      setError('Please fill all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${baseUrl}/api/auth/email-auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password, location_id: locationId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Registration failed');
      window.location.href = `/signup/verify?email=${encodeURIComponent(email)}`;
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <div className={styles.heroPane}>
          <div className={styles.heroMedia}>
            <Image src="/login_hero_image2.png" alt="Signup hero" fill sizes="(max-width: 960px) 100vw, 50vw" priority className={styles.heroImage} />
            <div className={styles.heroGradient} />
          </div>
          <div className={styles.heroContent}>
            <h2 className={styles.heroTitle}>Join Higgs Workspace</h2>
            <p className={styles.heroSubtitle}>Create your account to get started.</p>
          </div>
        </div>

        <div className={styles.formPane}>
          <div className={styles.formWrapper}>
            <div className={styles.brand}>
              <Image src="/icons/higgs.png" alt="Higgs logo" width={200} height={70} className={styles.logo} />
            </div>
            <h1 className={styles.heading}>Create your account</h1>
            <p className={styles.subheading}>Join Higgs Workspace</p>
            <form onSubmit={onSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Name</label>
                <input className={styles.input} placeholder="Jane Doe" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Email</label>
                <input className={styles.input} type="email" placeholder="jane@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Phone</label>
                <input className={styles.input} placeholder="+1 555-123-4567" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Location</label>
                <select className={styles.select} value={locationId} onChange={(e) => setLocationId(e.target.value)}>
                  <option value="">Select location</option>
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                  ))}
                </select>
                <span className={styles.hint}>Choose your preferred workspace location.</span>
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Password</label>
                <input className={styles.input} type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                <span className={styles.hint}>At least 6 characters.</span>
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Confirm Password</label>
                <input className={styles.input} type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
              {error && <p className={styles.error}>{error}</p>}
              <button className={styles.button} type="submit" disabled={loading}>{loading ? 'Signing up...' : 'Sign up'}</button>
            </form>
            <p className={styles.linkRow}>
              Already have an account? <Link href="/login">Login</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

