import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"; 
import { SessionProvider } from "./contexts/SessionContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Higgs Workspace',
  description: 'The customer portal for Higgs Coworking Space.',
  manifest: '/manifest.json',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const session = await getServerSession(authConfig);   

  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#1976D2" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* <ClientSessionProvider> */}
        <SessionProvider>
          {children}
        </SessionProvider>
        {/* </ClientSessionProvider> */}
      </body>
    </html>
  );
}