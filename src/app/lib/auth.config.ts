 
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// The rest of the file remains exactly the same.
export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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

        console.log(credentials.userType)

        const is_admin_login = credentials.userType === 'ADMIN';
        const endpoint = is_admin_login
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

          const data = await res.json();
          const userOrAdmin = data.user || data.admin;
          if (data.token && userOrAdmin) {
            return { ...userOrAdmin, backendToken: data.token };
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
        if (user) { 
          if (account?.provider === 'google') {
             try {
                  const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ credential: account.id_token }),
                  });
                  const data = await res.json();
                  if (res.ok) {
                      token.user = data.user;
                      token.backendToken = data.token;
                  }
              } catch (e) { console.error(e) }
          } else {
              token.user = user as any;
              token.backendToken = (user as any).backendToken;
          }
        }
        return token;
      },
      async session({ session, token }) {
        if (token.user) {
          session.user = token.user as any;
          session.backendToken = token.backendToken as string;
        }
        return session;
      },
  },
};