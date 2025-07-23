'use server';
 
import { update, signOut } from '@/auth';
import { getSession } from '@/lib/session';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { redirect } from 'next/navigation'; 


export async function refreshAuthSession() {
    try {
        console.log("Refreshing auth session...");
         
        const session = await getSession(); 
        console.log("Current session:", session);

        if (!session?.refreshToken || !session?.accessToken) {
            throw new Error('Refresh failed: No tokens found in session.');
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

        console.log(`Backend refresh response: ${response.status} ${response.statusText}`);
        
        if (!response.ok) {
            throw new Error('Backend refresh failed. Session is invalid.');
        }
        
        const newTokens = await response.json();
        console.log("Received new tokens:", newTokens);

        if (!newTokens.accessToken) {
            throw new Error('Backend did not return a valid new access token.');
        }
 
        await update({
            ...session,
            accessToken: newTokens.accessToken, 
        });

        console.log('[Auth Action] Session successfully updated.');
        return { success: true };

    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        }

        console.error("[Auth Action] Critical error during refresh, initiating sign out:", (error as Error).message);
        
        try {
             await signOut({ redirect: false });
        } catch (signOutError) {
            console.error("[Auth Action] Error while trying to sign out:", signOutError);
        } finally {
            redirect('/login?error=SessionExpired');
        }
    }
}