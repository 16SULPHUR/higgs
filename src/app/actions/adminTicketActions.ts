'use server';

import { revalidateTag } from 'next/cache';
import { api } from '@/lib/apiClient';

export async function createTicketForUserAction(payload: any) {
    try {
        const result = await api.post('/api/admin/support-tickets', payload);
        revalidateTag('admin-tickets');
        return { success: true, message: result.message };
    } catch (error: any) {
        const errorBody = JSON.parse(error.message || '{}');
        return { success: false, message: errorBody.message || 'Failed to create ticket.' };
    }
}

interface UpdateTicketPayload {
    status: string;
    response?: string;
}

export async function updateTicketStatusAction(ticketId: number, payload: UpdateTicketPayload) {
    try {
        await api.patch(`/api/admin/support-tickets/${ticketId}/status`, payload);
        revalidateTag('admin-tickets');
        revalidateTag(`admin-ticket-${ticketId}`);
        return { success: true, message: 'Ticket updated successfully.' };
    } catch (error: any) {
        try {
            const errorBody = JSON.parse(error.message);
            return { success: false, message: errorBody.message || 'Failed to update status.' };
        } catch (e) {
            return { success: false, message: 'A server error occurred.' };
        }
    }
}


export async function deleteTicketByAdminAction(ticketId: number) {
    try {
        await api.delete(`/api/admin/support-tickets/${ticketId}`);
        revalidateTag('admin-tickets');
        return { success: true, message: 'Ticket deleted successfully.' };
    } catch (error: any) {
        return { success: false, message: 'Failed to delete ticket.' };
    }
}