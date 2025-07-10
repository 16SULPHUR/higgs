'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';
import styles from './SignOutButton.module.css';

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/login' })}
      className={styles.signOutButton}
      title="Sign Out"
    >
      <LogOut size={16} />
      <span>Sign Out</span>
    </button>
  );
}