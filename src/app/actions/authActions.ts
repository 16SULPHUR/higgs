'use server';

import { update } from "@/lib/auth";
import { getSession } from "@/lib/session";

 
export async function refreshAuthSession() {
    try {
        const session = await getSession();
        if (!session?.refreshToken) {
            throw new Error('No refresh token found in session.');
        }

        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await fetch(`${baseUrl}/api/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: session.refreshToken }),
        });

        if (!response.ok) {
            console.error("Backend refresh failed");
            return { error: "Your session has expired. Please log in again." };
        }

        const newTokens = await response.json();

        // THIS IS THE KEY: Use the `update` function to securely update the session JWT
        await update({
            ...session,
            accessToken: newTokens.accessToken,
            refreshToken: newTokens.refreshToken,
        });

        return { success: true };

    } catch (error) {
        return { error: "Failed to refresh session." };
    }
}