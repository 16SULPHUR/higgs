'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';
import styles from './SignOutButton.module.css';
import { deleteCookie } from '@/lib/cookieUtils'; 

export default function SignOutButton() {
  const handleSignOut = async () => { 
    deleteCookie('accessToken');
    deleteCookie('refreshToken');
 
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <button
      onClick={handleSignOut}
      className={styles.signOutButton}
      title="Sign Out"
    >
      <LogOut size={16} />
      <span>Sign Out</span>
    </button>
  );
}
