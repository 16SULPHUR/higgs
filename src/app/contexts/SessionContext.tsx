'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { clearAllCookies, getCookie, setCookie } from '@/lib/cookieUtils';
import { getDecodedTokenExpiry } from '@/lib/tokenUtils';
import { tokenRefreshService } from '@/lib/tokenRefreshService';
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
  refreshAccessToken: () => Promise<string | null>;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSessionContext = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSessionContext must be used within a SessionProvider');
  }
  return context;
};

// Backward compatibility hook that returns just the session object
export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context.session;
};

export const useSessionActions = () => {
  const context = useContext(SessionContext);
  return {
    refreshSession: context?.refreshSession || (() => Promise.resolve()),
    refreshAccessToken: context?.refreshAccessToken || (() => Promise.resolve(null)),
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
      window.location.href = '/login';
    }
    throw error;
  }
}

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<CustomSession | null | undefined>(undefined);

  const initializeSession = useCallback(async () => {
    let accessToken = getCookie('accessToken');
    const refreshToken = getCookie('refreshToken');

    // If no access token at all, user is unauthenticated
    if (!accessToken) {
      setSession(null);
      return;
    }

    const expiry = getDecodedTokenExpiry(accessToken);

    // If token expired but we have a refresh token, try to refresh
    if (!expiry || Date.now() >= expiry) {
      if (refreshToken) {
        try {
          const data = await refreshAccessToken(refreshToken, accessToken);
          accessToken = data.accessToken;
          setCookie('accessToken', data.accessToken);
          setSession({ accessToken, refreshToken: data.refreshToken || refreshToken });
          
          // Schedule proactive refresh for the new token
          tokenRefreshService.scheduleProactiveRefresh();
          return;
        } catch (error) {
          console.error('Client token refresh failed', error);
          setSession({ accessToken: undefined, refreshToken, error: 'RefreshTokenError' });
          return;
        }
      } else {
        // No refresh token; proceed with a degraded session so client can still read cookies
        setSession({ accessToken, refreshToken: undefined });
        return;
      }
    }

    // Token valid; set session even if refresh token is missing
    setSession({ accessToken, refreshToken });
    
    // Schedule proactive refresh for the valid token
    tokenRefreshService.scheduleProactiveRefresh();
  }, []);

  const refreshAccessTokenContext = useCallback(async (): Promise<string | null> => {
    return tokenRefreshService.manualRefresh();
  }, []);

  useEffect(() => {
    initializeSession();
    
    // Cleanup function to stop proactive refresh when component unmounts
    return () => {
      tokenRefreshService.stopProactiveRefresh();
    };
  }, [initializeSession]);

  const contextValue = {
    session,
    refreshSession: initializeSession,
    refreshAccessToken: refreshAccessTokenContext,
  };

  return <SessionContext.Provider value={contextValue}>{children}</SessionContext.Provider>;
};
