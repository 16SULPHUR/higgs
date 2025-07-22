
import { refreshAuthSession } from '@/actions/authActions';
import { getSession } from './session';

type FetchOptions = {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: any;
    tags?: string[];
};

async function apiClient(endpoint: string, options: FetchOptions = {}) {
    console.log(`[API Client] Requesting: ${options.method || 'GET'} ${endpoint}`);
    const session = await getSession();
    let token = session?.accessToken;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    console.log("session", session);

    if (!baseUrl) {
        throw new Error(JSON.stringify({ message: "API base URL is not configured." }));
    }

    const headers: HeadersInit = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
        method: options.method || 'GET',
        headers,
        next: { tags: options.tags || [] }
    };

    if (options.body) {
        if (options.body instanceof FormData) {
            config.body = options.body;
        } else {
            headers['Content-Type'] = 'application/json';
            config.body = JSON.stringify(options.body);
        }
    }
    config.headers = headers;

    console.log(config)
    
    const fullUrl = `${baseUrl}${endpoint}`;
    console.log(`[API Client] Fetching URL: ${fullUrl}`);
    console.log(`[API Client] With token: ${!!token}`);

    let response = await fetch(fullUrl, config);
 
    if (response.status === 401) {
        console.log('[API Client] Access token expired. Triggering refresh action...');
        
        await refreshAuthSession();

        console.log('[API Client] Refresh successful. Retrying original request...');
        const newSession = await getSession();
        const newToken = newSession?.accessToken;

        if (newToken) {
            (config.headers as Record<string, string>)['Authorization'] = `Bearer ${newToken}`;
        }
        
        response = await fetch(`${baseUrl}${endpoint}`, config);
    }

    console.log(`[API Client] Response Status: ${response.status} for ${endpoint}`);

    if (!response.ok) {
        const errorBody = await response.text();
        console.error(`[API Client Error] ${response.status} for ${endpoint}:`, errorBody);
        throw new Error(errorBody);
    }

    if (response.status === 204) {
        console.log(`[API Client] Success with 204 No Content for ${endpoint}`);
        return null;
    }

    const responseForLogging = response.clone();
    const responseBodyText = await responseForLogging.text();
    const truncatedBody = responseBodyText.substring(0, 500) + (responseBodyText.length > 500 ? '...' : '');
    console.log(`[API Client] Success with ${response.status}. Response body for ${endpoint} (truncated):`, truncatedBody);

    return response.json();
}

export const api = {
    get: (endpoint: string, tags?: string[]) => apiClient(endpoint, { method: 'GET', tags }),
    post: (endpoint: string, body: any) => apiClient(endpoint, { method: 'POST', body }),
    put: (endpoint: string, body: any) => apiClient(endpoint, { method: 'PUT', body }),
    patch: (endpoint: string, body: any) => apiClient(endpoint, { method: 'PATCH', body }),
    delete: (endpoint: string) => apiClient(endpoint, { method: 'DELETE' }),
};