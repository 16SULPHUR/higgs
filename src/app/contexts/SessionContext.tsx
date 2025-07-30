'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getCookie, setCookie } from '@/lib/cookieUtils';
import { getDecodedTokenExpiry } from '@/lib/tokenUtils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type CustomSession = {
  user?: {
    name?: string;
    email?: string;
    profile_picture?: string;
    role?: string;
  }
  accessToken?: string;
  refreshToken?: string;
  error?: string;
};

type SessionContextType = {
  session: CustomSession | null | undefined;
  refreshSession: () => Promise<void>;
};
 
const SessionContext = createContext<SessionContextType | null>(null);

export const useSessionContext = () => {
  const context = useContext(SessionContext); 
  return context?.session;
};

export const useSessionActions = () => {
  const context = useContext(SessionContext);
  return {
    refreshSession: context?.refreshSession || (() => Promise.resolve()),
  };
};

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<CustomSession | null | undefined>(undefined);

  const initializeSession = useCallback(async () => {
    let accessToken = getCookie('accessToken');
    const refreshToken = getCookie('refreshToken');

    if (!accessToken || !refreshToken) {
      setSession(null);
      return;
    }

    const expiry = getDecodedTokenExpiry(accessToken);

    if (!expiry || Date.now() >= expiry) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            refreshToken,
            expiredAccessToken: accessToken,
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.accessToken) throw new Error('Failed to refresh');

        accessToken = data.accessToken;

        if (data.refreshToken) {
          setCookie('refreshToken', data.refreshToken);
        }
        setCookie('accessToken', data.accessToken);
      } catch (error) {
        console.error('Client token refresh failed', error);
        setSession({ accessToken: undefined, refreshToken, error: 'RefreshTokenError' });
        return;
      }
    }

    setSession({ accessToken, refreshToken });
  }, []);

  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  const contextValue = {
    session,
    refreshSession: initializeSession,
  };

  return <SessionContext.Provider value={contextValue}>{children}</SessionContext.Provider>;
};
