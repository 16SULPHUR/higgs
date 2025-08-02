'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { clearAllCookies, getCookie, setCookie } from '@/lib/cookieUtils';
import { getDecodedTokenExpiry } from '@/lib/tokenUtils';
import { jwtDecode } from 'jwt-decode';

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

export async function refreshAccessToken(refreshToken: string, expiredAccessToken: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        refreshToken
      }),
    });

    const data = await res.json();
    console.log("refresh token data");
    console.log(data);
    if (!res.ok || !data.accessToken) {
      if (typeof window !== 'undefined') {
        clearAllCookies();
        window.location.href = '/login';
      }
      throw new Error('Failed to refresh access token');
    }

    console.log("data");
    console.log(data.accessToken);
    const decodedData: any = jwtDecode(data.accessToken);
    console.log(decodedData);

    if (decodedData?.role) {
      setCookie('role', decodedData.role, 7);
    }

    return data;
  } catch (error) {
    if (typeof window !== 'undefined') {
      clearAllCookies();
      window.location.href = '/login?error=sessionExpired';
    }
    throw error;
  }
}

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
        const data = await refreshAccessToken(refreshToken, accessToken);

        accessToken = data.accessToken;
 
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
