// import { getServerSession } from 'next-auth';
// import { authConfig } from './auth.config';

// export interface AdminSession {
//   user:{
//     name: string;
//     email: string;
//     role: string;
//     backendToken: string;
//     profile_picture?: string;
//   }
// }

// export async function getSession(): Promise<AdminSession | null> {
//   const session = await getServerSession(authConfig) as (AdminSession & { user?: any }) | null;

//   if (!session || !session.user) {
//     return null;
//   }

//   return session as AdminSession;
// }

 
import { getServerSession } from 'next-auth';
import { authConfig } from './auth.config';

// Define the shape of your session object for type safety throughout your app.
export interface CustomSession {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    organization_id?: string;
    profile_picture?: string;
  };
  backendToken: string;
  accessToken?: string;
  refreshToken?: string;
}

/**
 * Gets the session on the server side using the official NextAuth helper.
 * This is now the single, reliable way to get session data.
 * @returns The session object or null if not authenticated.
 */
export async function getSession(): Promise<CustomSession | null> {
  // Call the imported 'auth' function directly. This will now work reliably.
    const session = await getServerSession(authConfig) as (CustomSession & { user?: any }) | null;

  if (!session || !session.user) {
    return null;
  }
  
  // Cast the session to your custom type for use in other parts of your app
  return session as CustomSession;
}



// {
//   user: {
//     id: '3b970307-9ed6-447b-9cb2-8909b585a813',
//     name: 'Ankit Patil',
//     role: 'INDIVIDUAL_USER',
//     organization_id: '43a8e374-f8c9-4ca6-a7bf-386652f33169',        
//     accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNiOTcwMzA3LTllZDYtNDQ3Yi05Y2IyLTg5MDliNTg1YTgxMyIsInR5cGUiOiJ1c2VyIiwiaWF0IjoxNzUzMDg3MzU4LCJleHAiOjE3NTMwODgyNTh9.isjpGITki4IouL2Uwh0VM6wquOBkH684ELg_AzKNjI4',
//     refreshToken: '15b20d9bc7e2d4f002e31e930a1aa37a09cc27e38d6b11ed4ad6e9f52db470a75abf67a604efca36'
//   },
//   accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNiOTcwMzA3LTllZDYtNDQ3Yi05Y2IyLTg5MDliNTg1YTgxMyIsInR5cGUiOiJ1c2VyIiwiaWF0IjoxNzUzMDg3MzU4LCJleHAiOjE3NTMwODgyNTh9.isjpGITki4IouL2Uwh0VM6wquOBkH684ELg_AzKNjI4',
//   refreshToken: '15b20d9bc7e2d4f002e31e930a1aa37a09cc27e38d6b11ed4ad6e9f52db470a75abf67a604efca36'
// }