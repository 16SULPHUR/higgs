import { getServerSession } from 'next-auth/next';
import { adminAuthOptions } from './adminAuth';



interface AdminSession {
    name?: string;
    email?: string;
    user: {
        id: string;
        role: string;
        
    };
    backendToken: string;
}


export async function getAdminSession(): Promise<AdminSession | null> {
 
    
    const session = await getServerSession(adminAuthOptions);

    if (!session || !session.user) {
        return null;
    }

    return session as AdminSession;
}