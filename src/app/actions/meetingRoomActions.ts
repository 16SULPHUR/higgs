'use server';

import { revalidateTag } from 'next/cache';
import { api } from '@/lib/apiClient';


interface RoomFormData {
    name: string;
    type_of_room: string;
    location_id: string;
    capacity: number;
    credits_per_booking: number;
    availability: boolean;
}


export async function saveRoom(formData: RoomFormData, roomId?: string) {
    try {
        if (roomId) {

            console.log(roomId)
            
            await api.patch(`/api/admin/meeting-rooms/${roomId}`, formData);
        } else {
            await api.post('/api/admin/meeting-rooms', formData);
        }

        revalidateTag('rooms');

        return { success: true, message: `Room ${roomId ? 'updated' : 'created'} successfully!` };

    } catch (error) {
        console.error("Save room failed:", error);
        return { success: false, message: 'An error occurred on the server. Please try again.' };
    }
}