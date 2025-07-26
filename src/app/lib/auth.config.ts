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
          if (!res.ok || !data.accessToken || !data.refreshToken) return null;

          const user = data.user || data.admin;

          

          return {
            ...user,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          };
        } catch (error) {
          console.error('Authorize error:', error);
          return null;
        }
      }
    })
  ],

  pages: {
    signIn: '/login',
  },

  callbacks: {
    async jwt({ token, user, account }) {
      // Initial login
      if (user) {
        token.user = user;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;

        if (user.accessToken) {
          const decoded = jwtDecode<DecodedToken>(user.accessToken);
          token.expiresAt = decoded.exp;
        }
      }

      // If access token still valid
      if (token.expiresAt && Date.now() < token.expiresAt * 1000) {
        return token;
      }

      // No refresh token to rotate
      if (!token.refreshToken) {
        token.error = 'RefreshTokenError';
        return token;
      }

      // Try to refresh token
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: token.refreshToken, expiredAccessToken: token.accessToken }),
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
      session.user = token.user as User;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.error = token.error;
      return session;
    }
  }
};
