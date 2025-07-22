'use server';

import { update } from '@/lib/auth';
import { getSession } from '@/lib/session';
import { signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';

export async function refreshAuthSession() {
    try {
        const session = await getSession();
        // Ensure we have both tokens before proceeding
        if (!session?.refreshToken || !session?.accessToken) {
            console.error("No refresh or access token found in session for refresh attempt.");
            await signOut({ redirect: false });
            redirect('/login?error=SessionExpired');
        }

        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await fetch(`${baseUrl}/api/auth/refresh-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                refreshToken: session.refreshToken,
                expiredAccessToken: session.accessToken
            }),
        });

        console.log("response.status, response.statusText");
        console.log(response.status, response.statusText);
        if (!response.ok) {
            console.error("[Auth Action] Backend refresh failed. Signing out.");
            await signOut({ redirect: false });
            redirect('/login?error=SessionExpired');
        }

        const newTokens = await response.json();

        await update({
            ...session,
            accessToken: newTokens.accessToken,
            refreshToken: newTokens.refreshToken,
        });

        return { success: true };

    } catch (error) {
        console.error("[Auth Action] Error during refresh, signing out:", error);
        await signOut({ redirect: false });
        redirect('/login?error=SessionExpired');
    }
}