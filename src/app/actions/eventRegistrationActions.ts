'use server';

import { revalidateTag } from 'next/cache';
import { api } from '@/lib/apiClient';

export async function registerForEventAction(eventId: string) {
    try {
        const result = await api.post(`/api/events/${eventId}/register`, {});
        revalidateTag('user-events');
        return { success: true, message: result.message };
    } catch (error: any) {
        try {
            const errorBody = JSON.parse(error.message);
            return { success: false, message: errorBody.message || 'Failed to register.' };
        } catch (e) {
            return { success: false, message: 'A server error occurred.' };
        }
    }
}

export async function withdrawFromEventAction(eventId: string) {
    try {
        const result = await api.delete(`/api/events/${eventId}/cancel-registration`);
        revalidateTag('user-events');
        return { success: true, message: result.message };
    } catch (error: any) {
        try {
            const errorBody = JSON.parse(error.message);
            return { success: false, message: errorBody.message || 'Failed to withdraw.' };
        } catch (e) {
            return { success: false, message: 'A server error occurred.' };
        }
    }
}