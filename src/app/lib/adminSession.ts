// import { adminAuthOptions } from './adminAuth';
// import { getServerSession } from 'next-auth/next'; 



// interface AdminSession {
//     name?: string;
//     email?: string;
//     user: {
//         id: string;
//         role: string;
        
//     };
//     backendToken: string;
// }


// export async function getAdminSession(): Promise<AdminSession | null> {
 
    
//     const session = await getServerSession(adminAuthOptions);

//     if (!session || !session.user) {
//         return null;
//     }

//     return session as AdminSession;
// }