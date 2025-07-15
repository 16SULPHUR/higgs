import { getSession } from './session';

type FetchOptions = {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: any;
    tags?: string[];
};

async function apiClient(endpoint: string, options: FetchOptions = {}) {
    console.log(`[API Client] Requesting: ${options.method || 'GET'} ${endpoint}`);
    const session = await getSession();
    const token = session?.backendToken;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    console.log("token===========================================================================")
    console.log(token)

    if (!baseUrl) {
        const errorMessage = "[API Client] FATAL: NEXT_PUBLIC_API_BASE_URL is not set.";
        console.error(errorMessage);
        throw new Error(JSON.stringify({ message: "API base URL is not configured on the server." }));
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

    const fullUrl = `${baseUrl}${endpoint}`;

    if (options.body) {
        if (typeof options.body === 'object' && options.body instanceof FormData) {
            config.body = options.body;
        } else if (options.body !== undefined) {
            headers['Content-Type'] = 'application/json';
            config.body = JSON.stringify(options.body);
        }

    }

    console.log(`[API Client] Fetching URL: ${fullUrl}`);
    console.log(`[API Client] METHOD: ${options.method || 'GET'}`);
    console.log(`[API Client] HEADERS}`);
    console.log(`[API Client] With token: ${!!token}`);

    const response = await fetch(fullUrl, config);

    console.log(`[API Client] Response Status: ${response.status} for ${endpoint}`);

    if (!response.ok) {
        // Read the error response body from the backend
        const errorBody = await response.text();
        console.error(`[API Client Error] ${response.status} for ${endpoint}:`, errorBody);

        // Throw an error where the message IS the error body.
        // This makes the detailed message available to the Server Action that called it.
        throw new Error(errorBody);
    }

    if (response.status === 204) {
        console.log(`[API Client] Success with 204 No Content for ${endpoint}`);
        return null;
    }

    // Clone the response to log the body without consuming it for the final return
    const responseForLogging = response.clone();
    const responseBodyText = await responseForLogging.text();
    const truncatedBody = responseBodyText.substring(0, 500) + (responseBodyText.length > 500 ? '...' : '');
    console.log(`[API Client] Success with ${response.status}. Response body for ${endpoint} (truncated):`, truncatedBody);

    // Return the original response stream to be parsed as JSON
    return response.json();
}

export const api = {
    get: (endpoint: string, tags?: string[]) => apiClient(endpoint, { method: 'GET', tags }),
    post: (endpoint: string, body: any) => apiClient(endpoint, { method: 'POST', body }),
    put: (endpoint: string, body: any) => apiClient(endpoint, { method: 'PUT', body }),
    patch: (endpoint: string, body: any) => apiClient(endpoint, { method: 'PATCH', body }),
    delete: (endpoint: string) => apiClient(endpoint, { method: 'DELETE' }),
};
