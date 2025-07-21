
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { User } from 'next-auth';

// --- THIS IS THE FIX ---
// 1. Update the type declarations to include both tokens.
declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
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
    user?: User;
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// The rest of the file remains exactly the same.
export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        userType: { label: "User Type", type: "hidden" }
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

          if (!res.ok) {
            console.error(`Login failed for ${credentials.email}:`, await res.text());
            return null;
          }

          // 2. Expect accessToken and refreshToken from the backend response.
          const data = await res.json();
          console.log("data========================")
          console.log(data)
          const userOrAdmin = data.user || data.admin;

          if (data.accessToken && data.refreshToken && userOrAdmin) {
            return {
              ...userOrAdmin,
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
            };
          }
          return null;
        } catch (error) {
          console.error("Authorize error:", error);
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
      // On initial sign-in, the 'user' object from authorize() is available.
      if (user) {
        if (account?.provider === 'google') {
          try {
            const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ credential: account.id_token }),
            });
            const data = await res.json();
            console.log("data========================")
            console.log(data)
            if (res.ok) {
              // 3. Store both tokens for Google login.
              token.accessToken = data.accessToken;
              token.refreshToken = data.refreshToken;
              token.user = data.user;
            }
          } catch (e) { console.error(e) }
        } else {
          // 4. Store both tokens for Credentials login.
          token.user = user as User;
          token.accessToken = user.accessToken;
          token.refreshToken = user.refreshToken;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        // 5. Expose both tokens to the session object.
        session.user = token.user;
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
      }
      return session;
    },
  },
};
