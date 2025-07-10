'use server';

import { revalidateTag } from 'next/cache';
import { api } from '@/lib/apiClient';

export async function sendGuestInviteAction(bookingId: string, guestName: string, guestEmail: string) {
    if (!bookingId || !guestName || !guestEmail) {
        return { success: false, message: 'All fields are required.' };
    }

    try {
        const payload = { guestName, guestEmail };
        const result = await api.post(`/api/bookings/${bookingId}/invite`, payload);
        revalidateTag('invitations');
        return { success: true, message: result.message };
    } catch (error: any) {
        try {
            const errorBody = JSON.parse(error.message);
            return { success: false, message: errorBody.message || 'Failed to send invite.' };
        } catch (e) {
            return { success: false, message: 'A server error occurred.' };
        }
    }
}