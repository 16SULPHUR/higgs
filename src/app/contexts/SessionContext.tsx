'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getCookie, setCookie } from '@/lib/cookieUtils'; // or use document.cookie manually
import { getDecodedTokenExpiry } from '@/lib/tokenUtils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type CustomSession = {
  accessToken?: string;
  refreshToken?: string;
  error?: string;
};

const SessionContext = createContext<CustomSession | null>(null);

export const useSessionContext = () => {
  return useContext(SessionContext);
};

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<CustomSession | null>(null);

  useEffect(() => {
    const initializeSession = async () => {
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
    };

    initializeSession();
  }, []);

  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
};
