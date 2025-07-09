'use server';

import { revalidateTag } from 'next/cache';
import { api } from '@/lib/apiClient';

export async function saveRoomType(formData: any, typeId?: string) {
    try {
        const payload = {
            ...formData,
            capacity: parseInt(formData.capacity),
            credits_per_booking: parseInt(formData.credits_per_booking),
        };
        if (typeId) {
            await api.patch(`/api/admin/room-types/${typeId}`, payload);
        } else {
            await api.post('/api/admin/room-types', payload);
        }
        revalidateTag('room-types');
        return { success: true, message: `Room Type ${typeId ? 'updated' : 'created'}.` };
    } catch (error) {
        return { success: false, message: 'Failed to save room type.' };
    }
}

export async function deleteRoomType(typeId: string) {
    try {
        await api.delete(`/api/admin/room-types/${typeId}`);
        revalidateTag('room-types');
        return { success: true };
    } catch (error: any) {
        return { success: false, message: error.message || 'Failed to delete room type.' };
    }
}