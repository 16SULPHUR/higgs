'use client';
import { getSession, signOut } from 'next-auth/react';

async function apiClient(endpoint: string, options: RequestInit = {}) {
    const session = await getSession();

    console.log(`[API Client] Requesting: ${options.method || 'GET'} ${endpoint}`);


    if (session?.error === 'RefreshTokenError') {
        await signOut({ callbackUrl: '/login?error=SessionExpired' });
        throw new Error('Session expired, please log in again.');
    }

    const headers = new Headers(options.headers || {});
    if (session?.accessToken) {
        headers.set('Authorization', `Bearer ${session.accessToken}`);
    }

    const config: RequestInit = { ...options, headers };
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;



    if (config.body) {
        if (config.body instanceof FormData) {
        } else {
            headers.set('Content-Type', 'application/json');
            config.body = JSON.stringify(config.body);
        }
    }

    let response = await fetch(`${baseUrl}${endpoint}`, config);
    console.log(`[API Client] Response Status: ${response.status} for ${endpoint}`);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || 'An API error occurred.');
    }

    if (response.status === 204) return null;
    return response.json();
}

export const api = {
    get: (endpoint: string) => apiClient(endpoint, { method: 'GET' }),
    post: (endpoint: string, body: any) => apiClient(endpoint, { method: 'POST', body }),
    patch: (endpoint: string, body: any) => apiClient(endpoint, { method: 'PATCH', body }),
    delete: (endpoint: string) => apiClient(endpoint, { method: 'DELETE' }),
};