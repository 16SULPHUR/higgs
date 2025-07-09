'use server';

import { revalidateTag } from 'next/cache';
import { api } from '@/lib/apiClient';

export async function saveRoom(formData: any, roomId?: string) {
    try {
        if (roomId) {
            await api.patch(`/api/admin/rooms/${roomId}`, formData);
        } else {
            await api.post('/api/admin/rooms', formData);
        }
        revalidateTag('rooms');
        return { success: true, message: `Room instance ${roomId ? 'updated' : 'created'}.` };
    } catch (error) {
        return { success: false, message: 'Failed to save room instance.' };
    }
}

export async function deleteRoom(roomId: string) {
    try {
        await api.delete(`/api/admin/rooms/${roomId}`);
        revalidateTag('rooms');
        return { success: true };
    } catch (error) {
        return { success: false, message: 'Failed to delete room instance.' };
    }
}