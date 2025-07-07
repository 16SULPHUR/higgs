import { getServerSession } from 'next-auth';
import { authOptions } from './auth';

export interface AdminSession {
  user:{
    name: string;
    email: string;
    role: string;
    backendToken: string;
  }
}

export async function getSession(): Promise<AdminSession | null> {
  const session = await getServerSession(authOptions) as (AdminSession & { user?: any }) | null;

  if (!session || !session.user) {
    return null;
  }

  return session as AdminSession;
}