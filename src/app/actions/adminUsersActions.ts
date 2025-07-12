'use server';

import { revalidateTag } from 'next/cache';
import { api } from '@/lib/apiClient';

export async function createUserByAdminAction(payload: any) {
    try {
        const result = await api.post('/api/admin/users', payload);
        revalidateTag('admin-users');
        return { success: true, message: result.message };
    } catch (error: any) {
        try {
            const errorBody = JSON.parse(error.message);
            return { success: false, message: errorBody.message || 'Failed to create user.' };
        } catch (e) {
            return { success: false, message: 'A server error occurred.' };
        }
    }
}


export async function saveUserByAdminAction(userId: string, payload: any) {
    try {
        await api.patch(`/api/admin/users/${userId}`, payload);
        revalidateTag('admin-users');
        return { success: true, message: 'User updated successfully.' };
    } catch (error: any) {
        const errorBody = JSON.parse(error.message || '{}');
        return { success: false, message: errorBody.message || 'Failed to update user.' };
    }
}

export async function toggleUserStatusAction(userId: string, currentStatus: boolean) {
    try {
        await api.patch(`/api/admin/users/${userId}`, { is_active: !currentStatus });
        revalidateTag('admin-users');
        return { success: true };
    } catch (error: any) {
        return { success: false, message: 'Failed to update user status.' };
    }
}

export async function deleteUserAction(userId: string) {
    try {
        await api.delete(`/api/admin/users/${userId}`);
        revalidateTag('admin-users');
        return { success: true };
    } catch (error: any) {
        return { success: false, message: 'Failed to delete user.' };
    }
}