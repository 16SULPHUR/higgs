'use client';
import { SessionContext } from './SessionContext';
import { Session } from 'next-auth';

export default function SessionContextProvider({
  children,
  session,
}: {
  children: React.ReactNode,
  session: Session | null
}) {
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}
