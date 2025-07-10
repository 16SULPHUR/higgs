'use server';
import { URLSearchParams } from 'url';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { api } from '@/lib/apiClient';

interface SearchCriteria {
    date: string;
    startTime: string;
    endTime: string;
    capacity: string;
}

export async function searchAvailableRoomTypesAction(criteria: SearchCriteria) {
    try {
        const queryParams = new URLSearchParams(
            Object.entries(criteria)
        ).toString();
        const data = await api.get(`/api/meeting-rooms/search?${queryParams}`);
        return { success: true, data: data };
    } catch (error) {
        console.error("Server Action: Room Type search failed:", error);
        return { success: false, error: 'An error occurred while searching.' };
    }
}

interface BookingPayload {
    type_of_room_id: string;
    start_time: string;
    end_time: string;
}

export async function createBookingAction(payload: BookingPayload) {
    try {
        await api.post('/api/bookings', payload);
        revalidateTag('bookings');
    } catch (error: any) {
        console.error("Create booking failed:", error.message);
         
        try {
            const errorBody = JSON.parse(error.message); 
            return { success: false, message: errorBody.message || 'An unknown error occurred.' };
        } catch (parseError) {
            
            return { success: false, message: 'Could not connect to the booking service. Please try again later.' };
        }
    }
    redirect('/dashboard/my-bookings');
}

export async function cancelBookingAction(bookingId: string) {
    if (!bookingId) {
        return { success: false, message: 'Booking ID is required.' };
    }
    try {
        const result = await api.delete(`/api/bookings/${bookingId}`);
        revalidateTag('bookings');
        return { success: true, message: result.message || 'Booking cancelled successfully.' };
    } catch (error: any) {
        console.error("Cancel booking failed:", error.message);
 
        try {
            const errorBody = JSON.parse(error.message);
            return { success: false, message: errorBody.message || 'Failed to cancel booking.' };
        } catch (parseError) {
            return { success: false, message: 'A server error occurred while trying to cancel.' };
        }
    }
}