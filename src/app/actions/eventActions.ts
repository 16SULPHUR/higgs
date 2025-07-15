'use server';

import { revalidateTag } from 'next/cache';
import { api } from '@/lib/apiClient';

export async function saveEvent(formData: FormData, eventId?: string) {
    try {
        // Step 1: Extract all data from the incoming FormData from the client.
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const date = formData.get('date') as string;
        const imageFile = formData.get('eventImage') as File | null;

        // Step 2: Create a NEW FormData object for the Node.js environment.
        const nodeFormData = new FormData();

        // Step 3: Append the text fields to the new FormData.
        nodeFormData.append('title', title);
        nodeFormData.append('description', description);
        nodeFormData.append('date', date);
        
        // Step 4: If an image file exists, convert it to a Buffer and then a Blob.
        if (imageFile && imageFile.size > 0) {
            // Convert the File's ArrayBuffer to a Node.js Buffer
            const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
            // Create a Blob from the Buffer, which Node's fetch can handle reliably.
            const imageBlob = new Blob([imageBuffer], { type: imageFile.type });
            // Append the blob to the new form data with the original filename.
            nodeFormData.append('eventImage', imageBlob, imageFile.name);
        }

        console.log("nodeFormData=========")
        console.log(nodeFormData)

        // Step 5: Pass the new, Node.js-compatible FormData to the apiClient.
        if (eventId) {
            await api.patch(`/api/admin/events/${eventId}`, nodeFormData);
        } else {
            await api.post('/api/admin/events', nodeFormData);
        }

        revalidateTag('events');
        return { success: true, message: `Event ${eventId ? 'updated' : 'created'} successfully.` };

    } catch (error: any) {
        try {
            const errorBody = JSON.parse(error.message);
            return { success: false, message: errorBody.message || 'Failed to save event.' };
        } catch (e) {
            return { success: false, message: 'A server error occurred.' };
        }
    }
}

export async function deleteEvent(eventId: string) {
    try {
        await api.delete(`/api/admin/events/${eventId}`);
        revalidateTag('events');
        return { success: true };
    } catch (error: any) {
        return { success: false, message: 'Failed to delete event.' };
    }
}