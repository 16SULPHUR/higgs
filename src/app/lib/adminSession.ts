import { getServerSession } from 'next-auth/next';
import { adminAuthOptions } from './adminAuth'; // Import the ADMIN-specific options

// Define the shape of your admin session
interface AdminSession {
    name?: string;
    email?: string;
    user: {
        id: string;
        role: string;
        // add other admin properties here
    };
    backendToken: string;
}

/**
 * Gets the session data for an ADMIN on the server side.
 * @returns The admin session object or null if not authenticated.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
    // The logic for getServerSession with options is different and was already correct.
    // No change is needed here, but it's good to confirm it's using the right pattern.
    const session = await getServerSession(adminAuthOptions);

    if (!session || !session.user) {
        return null;
    }

    return session as AdminSession;
}