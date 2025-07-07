import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

import type { Session } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    backendToken?: string;
    user?: any;
  }
}


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const authOptions = {
  providers: [
    
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    
    
    CredentialsProvider({
      name: 'Admin Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
            
          const res = await fetch(`${API_BASE_URL}/api/auth/email-auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });
          
          if (!res.ok) {
            console.error("Credentials login failed from backend");
            return null; 
            
          }

          const { token, admin } = await res.json();
          
          
          return {
            ...admin,
            backendToken: token,
          };
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    
    async jwt({ token, user, account }: { token: any; user?: any; account?: any }) {
    
      if (account && user) {
        if (account.provider === 'google') {
            
            try {
                const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ credential: account.id_token }),
                });
                
                const data = await res.json();
                token.backendToken = data.token;
                token.user = data.user;
            } catch (error) {
                console.error("Error fetching backend token for Google user", error);
                
            }
        } else if (account.provider === 'credentials') {
            
            token.backendToken = (user as any).backendToken;
            token.user = user;
        }
      }
      return token;
    },

    async session({ session, token }: { session: Session; token: any }) {
        
      session.backendToken = token.backendToken as string;
      session.user = token.user as any;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  }
};

export const { handlers, signIn, signOut } = NextAuth(authOptions);