// import NextAuth from 'next-auth';
// import CredentialsProvider from 'next-auth/providers/credentials';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// export const adminAuthOptions = {
//   providers: [
    
//     CredentialsProvider({
//       name: 'Admin Credentials',
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" }
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) return null;
//         try {
//           const res = await fetch(`${API_BASE_URL}/api/admin/auth/login`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(credentials),
//           });

//           if (!res.ok) {
//             console.error("Admin credentials login failed:", await res.text());
//             return null;
//           }

//           const { token, admin } = await res.json();
//           if (token && admin) {
//             return { ...admin, backendToken: token };
//           }
//           return null;
//         } catch (error) {
//           console.error("Admin authorize error:", error);
//           return null;
//         }
//       }
//     })
//   ],
//   callbacks: {
//     async jwt({ token, user }: { token: any; user?: any }) {
//       if (user) {
//         token.user = user;
//         token.backendToken = (user as any).backendToken;
//       }
//       return token;
//     },
//     async session({ session, token }: { session: any; token: any }) {
//       if (token.user) {
//         session.user = token.user as any;
//         session.backendToken = token.backendToken as string;
//       }
//       return session;
//     },
//   },
//   pages: {
//     signIn: '/admin/login', 
    
//   },
  
//   cookies: {
//     sessionToken: {
//       name: `__Secure-admin.next-auth.session-token`,
//       options: {
//         httpOnly: true,
//         sameSite: 'lax',
//         path: '/',
//         secure: process.env.NODE_ENV === 'production',
//       },
//     },
//   },
// };


// export const {
//   handlers: { GET, POST },
  
//   signIn: adminSignIn,     
  
//   signOut: adminSignOut,
//   auth: adminAuth,        
  
// } = NextAuth(adminAuthOptions);