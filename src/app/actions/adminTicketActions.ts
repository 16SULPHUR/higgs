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

export async function updateTicketStatusAction(ticketId: number, status: string) {
    try {
        await api.patch(`/api/admin/support-tickets/${ticketId}/status`, { status });
        revalidateTag('admin-tickets');
        revalidateTag(`admin-ticket-${ticketId}`);
        return { success: true, message: 'Ticket status updated successfully.' };
    } catch (error: any) {
        const errorBody = JSON.parse(error.message || '{}');
        return { success: false, message: errorBody.message || 'Failed to update status.' };
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