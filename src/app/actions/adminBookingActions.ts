'use server';

import { revalidateTag } from 'next/cache';
import { api } from '@/lib/apiClient';

export async function cancelBookingByAdmin(bookingId: string) {
    if (!bookingId) {
        return { success: false, message: 'Booking ID is required.' };
    }
    try {
        const result = await api.delete(`/api/admin/bookings/${bookingId}`);
        revalidateTag('admin-bookings');
        return { success: true, message: result.message || 'Booking cancelled successfully by admin.' };
    } catch (error: any) {
        try {
            const errorBody = JSON.parse(error.message);
            return { success: false, message: errorBody.message || 'Failed to cancel booking.' };
        } catch (e) {
            return { success: false, message: 'A server error occurred.' };
        }
    }
}