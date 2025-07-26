'use client';

import { signOut } from 'next-auth/react';

// Helper to read cookie by name
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(';').shift()!;
  return null;
}

async function apiClient(
  endpoint: string,
  options: RequestInit = {}
) {
  console.log(`[API Client] Requesting: ${options.method || 'GET'} ${endpoint}`);

  const accessToken = getCookie('accessToken');
  const refreshTokenError = getCookie('refreshTokenError'); 

  console.log("accessToken")
  console.log(accessToken)

  if (refreshTokenError === 'true') {
    await signOut({ callbackUrl: '/login?error=SessionExpired' });
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
  get: (e: string) => apiClient(e, { method: 'GET' }),
  post: (e: string, b: any) => apiClient(e, { method: 'POST', body: b }),
  patch: (e: string, b: any) => apiClient(e, { method: 'PATCH', body: b }),
  delete: (e: string) => apiClient(e, { method: 'DELETE' }),
};
