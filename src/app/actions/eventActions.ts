'use server';

import { revalidateTag } from 'next/cache';
import { api } from '@/lib/apiClient';
import { cookies } from 'next/headers';

interface EventFormData {
    title: string;
    description: string;
    date: string; 
    eventImage?: string;
}

export async function saveEvent(formData: EventFormData, eventId?: string) {
    try {
        let body: FormData | string;
        let headers: any = {};

        if (formData.eventImage) {
            body = new FormData();
            body.append('title', formData.title);
            body.append('description', formData.description);
            body.append('date', formData.date);
            body.append('eventImage', formData.eventImage); 
        } else {
            body = JSON.stringify(formData);
            headers['Content-Type'] = 'application/json';
        }

        const token = (await cookies()).get('auth-token')?.value;
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const endpoint = eventId ? `/api/admin/events/${eventId}` : '/api/admin/events';
        const method = eventId ? 'PATCH' : 'POST';

        const response = await fetch(`${baseUrl}${endpoint}`, {
            method,
            headers,
            body,
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(errorBody);
        }

        revalidateTag('events');
        return { success: true, message: `Event ${eventId ? 'updated' : 'created'} successfully.` };
    } catch (error) {
        console.error("Save event failed:", error);
        return { success: false, message: 'Failed to save event. Please check the fields.' };
    }
}

export async function deleteEvent(eventId: string) {
    try {
        await api.delete(`/api/admin/events/${eventId}`);
        revalidateTag('events');
        return { success: true };
    } catch (error) {
        console.error("Delete event failed:", error);
        return { success: false, message: 'Failed to delete event.' };
    }
}