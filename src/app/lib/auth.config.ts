import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { User } from 'next-auth'; 
import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    error?: 'RefreshTokenError';
    user: User;
  }

  interface User {
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    user?: User;
    error?: 'RefreshTokenError';
  }
}

type DecodedToken = {
  exp: number;
};

export const authConfig  = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: { params: { access_type: 'offline', prompt: 'consent' } },
    }),

    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        userType: { label: "User Type", type: "hidden" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const endpoint = credentials.userType === 'ADMIN'
          ? `${API_BASE_URL}/api/admin/auth/login`
          : `${API_BASE_URL}/api/auth/email-auth/login`;

        try {
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await res.json();
          if (!res.ok) {
            throw new Error(data?.message || 'Login failed.');
          }
          if (!data.accessToken || !data.refreshToken) {
            throw new Error('Invalid server response.');
          }

                  const user = data.user || data.admin;

        console.log("user=====================")
        console.log(user)

        const userData = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          locationId: user.locationId || user.location_id || null,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        };
        
        console.log('Authorize function returning user data:', userData);
        return userData;
        } catch (error: any) {
          const message = error?.message || 'Login failed.';
          throw new Error(message);
        }
      }
    })
  ],

  pages: {
    signIn: '/login',
  },

  callbacks: {
    async jwt({ token, user, account }) { 
      console.log('JWT callback - user:', user);
      console.log('JWT callback - token before:', token);
      
      if (user) {
        token.user = user;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;

        if (user.accessToken) {
          const decoded = jwtDecode<DecodedToken>(user.accessToken);
          token.expiresAt = decoded.exp;
        }
      }
      
      console.log('JWT callback - token after:', token);
 
      if (token.expiresAt && Date.now() < token.expiresAt * 1000) {
        return token;
      }
 
      if (!token.refreshToken) {
        token.error = 'RefreshTokenError';
        return token;
      }
 
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: token.refreshToken }),
        });

        const data = await res.json();

        console.log("data=====================")
        console.log(data)

        if (!res.ok || !data.accessToken) throw data;

        const decoded = jwtDecode<DecodedToken>(data.accessToken);

        return {
          ...token,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken || token.refreshToken,
          expiresAt: decoded.exp,
        };
      } catch (error) {
        console.error('Error refreshing access token:', error);
        token.error = 'RefreshTokenError';
        return token;
      }
    },

    async session({ session, token }) {
      console.log('Session callback - token:', token);
      console.log('Session callback - session before:', session);
      
      session.user = token.user as User;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.error = token.error;
      
      console.log('Session callback - session after:', session);
      return session;
    }
  }
};
