import { cookies } from 'next/headers';
import { getSession } from './session';

type FetchOptions = {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: any;
    tags?: string[];
};

async function apiClient(endpoint: string, options: FetchOptions = {}) {
    const session = await getSession();
    const token = session?.user?.backendToken;
    console.log(token)
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
        method: options.method || 'GET',
        headers,

        next: { tags: options.tags || [] }
    };

    if (options.body instanceof FormData) {

        config.body = options.body;
    } else if (options.body) {

        headers['Content-Type'] = 'application/json';
        config.body = JSON.stringify(options.body);
    }

    const response = await fetch(`${baseUrl}${endpoint}`, config);

    if (!response.ok) {
        const errorBody = await response.text();
        console.error(`API Error: ${response.status} ${endpoint}`, errorBody);
        throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}

export const api = {
    get: (endpoint: string, tags?: string[]) => apiClient(endpoint, { method: 'GET', tags }),
    post: (endpoint: string, body: any) => apiClient(endpoint, { method: 'POST', body }),
    put: (endpoint: string, body: any) => apiClient(endpoint, { method: 'PUT', body }),
    patch: (endpoint: string, body: any) => apiClient(endpoint, { method: 'PATCH', body }),
    delete: (endpoint: string) => apiClient(endpoint, { method: 'DELETE' }),
};