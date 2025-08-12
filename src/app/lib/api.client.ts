'use client';

import { useSessionContext } from '@/contexts/SessionContext';
import { signOut } from 'next-auth/react';
import { getCookie } from './cookieUtils';

interface AppSession {
    accessToken?: string;
    refreshToken?: string;
}
 

async function apiClient(
  endpoint: string,
  options: RequestInit = {},
  session: AppSession | null = null
) {
  console.log(`[API Client] Requesting: ${options.method || 'GET'} ${endpoint}`); 
  console.log(session)

  const accessToken = session?.accessToken || getCookie('accessToken');
  const refreshToken = session?.refreshToken || getCookie('refreshToken');
  const refreshTokenError = getCookie('refreshTokenError'); 
 

  // Do not hard sign out on this flag; allow pages to handle token refresh via SessionProvider
  if (refreshTokenError === 'true') {
    // Soft error to allow callers to react
    throw new Error('Session expired, please log in again.');
  }

  const headers = new Headers(options.headers || {});
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  if (options.body) {
    if (!(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
      options.body = JSON.stringify(options.body);
    }
  }

  const config: RequestInit = { ...options, headers };
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  console.log(config)

  const response = await fetch(`${baseUrl}${endpoint}`, config);
  console.log(`[API Client] Response Status: ${response.status} for ${endpoint}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'An API error occurred.');
  }

  if (response.status === 204) return null;
  return response.json();
}
 
export const api = {
  get: (session: AppSession | null, e: string) => apiClient(e, { method: 'GET' }, session),
  post: (session: AppSession | null, e: string, b: any) => apiClient(e, { method: 'POST', body: b }, session),
  patch: (session: AppSession | null, e: string, b: any) => apiClient(e, { method: 'PATCH', body: b }, session),
  delete: (session: AppSession | null, e: string) => apiClient(e, { method: 'DELETE' }, session),
};
