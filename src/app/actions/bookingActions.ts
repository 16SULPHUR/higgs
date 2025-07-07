'use server';

import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { api } from '@/lib/apiClient';

interface BookingPayload {
    room_id: string;
    start_time: string;
    end_time: string;
}


export async function createBookingAction(payload: BookingPayload) {
    try {
        await api.post('/api/bookings', payload);

     
        
        revalidateTag('bookings');

    } catch (error: any) {
        console.error("Create booking failed:", error);
        
        return { success: false, message: error.message || 'An unknown error occurred during booking.' };
    }

    
    redirect('/dashboard/my-bookings');
}


export async function cancelBookingAction(bookingId: string) {
    if (!bookingId) {
        return { success: false, message: 'Booking ID is required.' };
    }
    try {
        await api.delete(`/api/bookings/${bookingId}`);
        revalidateTag('bookings');
        return { success: true, message: 'Booking cancelled successfully.' };
    } catch (error: any) {
        console.error("Cancel booking failed:", error);
        return { success: false, message: error.message || 'Failed to cancel booking.' };
    }
}