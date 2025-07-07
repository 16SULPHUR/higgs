// import type { NextAuthOptions } from 'next-auth';
// import GoogleProvider from 'next-auth/providers/google';
// import CredentialsProvider from 'next-auth/providers/credentials';
// import type { User } from 'next-auth';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// declare module 'next-auth' {
//   interface User {
//     backendToken?: string;
//   }
//   interface Session {
//     backendToken?: string;
//     user: User;
//   }
// }

// declare module 'next-auth/jwt' {
//   interface JWT {
//     backendToken?: string;
//     user?: User;
//   }
// }


// // This object contains all the configuration for your USER authentication.
// export const userAuthOptions: NextAuthOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//     }),
//     CredentialsProvider({
//       name: 'User Credentials',
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" }
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) return null;
//         try {
//           const res = await fetch(`${API_BASE_URL}/api/email-auth/login`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(credentials),
//           });
//           if (!res.ok) return null;
//           const { token, user } = await res.json();
//           if (token && user) {
//             return { ...user, backendToken: token };
//           }
//           return null;
//         } catch (error) {
//           return null;
//         }
//       }
//     })
//   ],
//   callbacks: {
//       async jwt({ token, user, account }) {
//         if (account && user) {
//           if (account.provider === 'google') {
//             try {
//               const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ credential: account.id_token }),
//               });
//               const data = await res.json();
//               if (res.ok) {
//                 token.backendToken = data.token;
//                 token.user = data.user;
//               }
//             } catch (error) { console.error(error); }
//           } else if (account.provider === 'credentials') {
//             token.backendToken = user.backendToken;
//             token.user = user;
//           }
//         }
//         return token;
//       },
//       async session({ session, token }) {
//         if (token.user) {
//           session.user = token.user;
//           session.backendToken = token.backendToken;
//         }
//         return session;
//       },
//     },
//   pages: {
//     signIn: '/login',
//   },
// };