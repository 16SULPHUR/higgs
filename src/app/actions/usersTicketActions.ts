'use server';

import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { api } from '@/lib/apiClient';

interface TicketPayload {
    subject: string;
    description: string;
}

export async function createTicketAction(payload: TicketPayload) {
    try {
        await api.post('/api/support-tickets', payload);
        revalidateTag('user-tickets');
    } catch (error: any) {
        try {
            const errorBody = JSON.parse(error.message);
            return { success: false, message: errorBody.message || 'Failed to create ticket.' };
        } catch (e) {
            return { success: false, message: 'A server error occurred.' };
        }
    }
    redirect('/dashboard/support');
}

export async function deleteTicketAction(ticketId: number) {
    try {
        await api.delete(`/api/support-tickets/${ticketId}`);
        revalidateTag('user-tickets');
    } catch (error: any) {
        const errorBody = JSON.parse(error.message || '{}');
        return { success: false, message: errorBody.message || 'Failed to delete ticket.' };
    }
    redirect('/dashboard/support');
}