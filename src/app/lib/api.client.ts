'use client';

import { useSessionContext } from '@/contexts/SessionContext';
import { signOut } from 'next-auth/react';
import { getCookie, setCookie } from './cookieUtils';
import { getDecodedTokenExpiry } from './tokenUtils';

interface AppSession {
    accessToken?: string;
    refreshToken?: string;
    user?: {
        name?: string;
        email?: string;
        profile_picture?: string;
        role?: string;
    };
    error?: string;
}

// Union type to handle both session formats
type SessionInput = AppSession | { session: AppSession | null | undefined } | null;

// Helper type guard to check if input has session property
function hasSessionProperty(input: any): input is { session: AppSession | null | undefined } {
  return input && typeof input === 'object' && 'session' in input;
}

// Helper type guard to check if input is AppSession
function isAppSession(input: any): input is AppSession {
  return input && typeof input === 'object' && ('accessToken' in input || 'refreshToken' in input);
}

// Token refresh state to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

/**
 * Extracts the actual session object from various input types
 */
function extractSession(sessionInput: SessionInput): AppSession | null {
  if (!sessionInput) return null;
  
  // If it's already an AppSession, return it directly
  if (isAppSession(sessionInput)) {
    return sessionInput;
  }
  
  // If it has a session property, extract it
  if (hasSessionProperty(sessionInput)) {
    return sessionInput.session || null;
  }
  
  return null;
}

/**
 * Checks if a token is expired or will expire soon (within 1 minute)
 */
function isTokenExpired(token: string): boolean {
  const expiry = getDecodedTokenExpiry(token);
  if (!expiry) return true;
  
  // Consider token expired if it expires within 1 minute
  const bufferTime = 60 * 1000; // 1 minute in milliseconds
  return Date.now() >= (expiry - bufferTime);
}

/**
 * Refreshes the access token using the refresh token
 */
async function refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; refreshToken?: string }> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await res.json();
    
    if (!res.ok || !data.accessToken) {
      throw new Error(data?.message || 'Failed to refresh access token');
    }

    // Update cookies with new tokens
    setCookie('accessToken', data.accessToken, 7);
    if (data.refreshToken) {
      setCookie('refreshToken', data.refreshToken, 7);
    }

    return data;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    
    // Clear cookies and redirect to login on refresh failure
    if (typeof window !== 'undefined') {
      const { clearAllCookies } = await import('./cookieUtils');
      clearAllCookies();
      window.location.href = '/login';
    }
    
    throw error;
  }
}

/**
 * Ensures a valid access token is available, refreshing if necessary
 */
async function ensureValidToken(sessionInput: SessionInput): Promise<string | null> {
  const session = extractSession(sessionInput);
  const accessToken = session?.accessToken || getCookie('accessToken');
  const refreshToken = session?.refreshToken || getCookie('refreshToken');

  // If no access token, return null
  if (!accessToken) {
    return null;
  }

  // If token is not expired, return it
  if (!isTokenExpired(accessToken)) {
    return accessToken;
  }

  // If no refresh token, return null
  if (!refreshToken) {
    return null;
  }

  // If already refreshing, wait for the existing refresh
  if (isRefreshing && refreshPromise) {
    try {
      const result = await refreshPromise;
      return result.accessToken;
    } catch (error) {
      return null;
    }
  }

  // Start refresh process
  isRefreshing = true;
  refreshPromise = refreshAccessToken(refreshToken);

  try {
    const result = await refreshPromise;
    return result.accessToken;
  } catch (error) {
    return null;
  } finally {
    isRefreshing = false;
    refreshPromise = null;
  }
}

async function apiClient(
  endpoint: string,
  options: RequestInit = {},
  sessionInput: SessionInput = null
) {
  console.log(`[API Client] Requesting: ${options.method || 'GET'} ${endpoint}`); 
  console.log(sessionInput);

  // Check for refresh token error
  const refreshTokenError = getCookie('refreshTokenError'); 
  if (refreshTokenError === 'true') { 
    throw new Error('Session expired, please log in again.');
  }

  // Ensure we have a valid token
  const accessToken = await ensureValidToken(sessionInput);
  
  if (!accessToken) {
    throw new Error('No valid access token available. Please log in again.');
  }

  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${accessToken}`);

  if (options.body) {
    if (!(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
      options.body = JSON.stringify(options.body);
    }
  }

  const config: RequestInit = { ...options, headers };
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  console.log(config);

  const response = await fetch(`${baseUrl}${endpoint}`, config);
  console.log(`[API Client] Response Status: ${response.status} for ${endpoint}`);

  // Handle 401 Unauthorized - token might be invalid despite our checks
  if (response.status === 401) {
    console.warn('[API Client] Received 401 Unauthorized. Attempting token refresh...');
    
    // Try to refresh token and retry the request once
    try {
      const session = extractSession(sessionInput);
      const refreshToken = session?.refreshToken || getCookie('refreshToken');
      if (refreshToken) {
        const newTokens = await refreshAccessToken(refreshToken);
        const newHeaders = new Headers(options.headers || {});
        newHeaders.set('Authorization', `Bearer ${newTokens.accessToken}`);
        
        const retryConfig: RequestInit = { ...options, headers: newHeaders };
        const retryResponse = await fetch(`${baseUrl}${endpoint}`, retryConfig);
        
        if (!retryResponse.ok) {
          const errorData = await retryResponse.json().catch(() => ({ message: retryResponse.statusText }));
          throw new Error(errorData.message || 'An API error occurred after token refresh.');
        }
        
        if (retryResponse.status === 204) return null;
        return retryResponse.json();
      }
    } catch (refreshError) {
      console.error('[API Client] Token refresh failed during retry:', refreshError);
    }
    
    // If refresh failed or no refresh token, throw the original error
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Unauthorized. Please log in again.');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'An API error occurred.');
  }

  if (response.status === 204) return null;
  return response.json();
}
 
export const api = {
  get: (session: SessionInput, e: string) => apiClient(e, { method: 'GET' }, session),
  post: (session: SessionInput, e: string, b: any) => apiClient(e, { method: 'POST', body: b }, session),
  put: (session: SessionInput, e: string, b: any) => apiClient(e, { method: 'PUT', body: b }, session),
  patch: (session: SessionInput, e: string, b: any) => apiClient(e, { method: 'PATCH', body: b }, session),
  delete: (session: SessionInput, e: string) => apiClient(e, { method: 'DELETE' }, session),
};
