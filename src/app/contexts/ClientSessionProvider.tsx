// app/contexts/ClientSessionProvider.tsx
'use client';
import { useEffect, useState } from 'react'; 
import SessionContextProvider from './SessionContextProvider';

export default function ClientSessionProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch session only on client-side
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        setSession(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }

  return (
    <SessionContextProvider session={session}>
      {children}
    </SessionContextProvider>
  );
}
