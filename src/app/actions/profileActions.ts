'use server';

import { revalidateTag } from 'next/cache';
import { api } from '@/lib/apiClient';

export async function updateUserProfileAction(formData: FormData) {
    try {
        const result = await api.patch('/api/profile', formData);
        revalidateTag('user-profile');
        return { success: true, message: 'Profile updated successfully!', data: result };
    } catch (error: any) {
        try {
            const errorBody = JSON.parse(error.message);
            return { success: false, message: errorBody.message || 'Failed to update profile.' };
        } catch (e) {
            return { success: false, message: 'A server error occurred.' };
        }
    }
}