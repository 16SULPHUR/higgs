'use server';
import { api } from "@/lib/apiClient";

 




interface SearchCriteria {
    date: string;
    startTime: string;
    endTime: string;
    capacity: string;
}


export async function searchRoomsAction(criteria: SearchCriteria) {
    try {
        
        const queryParams = new URLSearchParams(
            Object.fromEntries(
                Object.entries(criteria).map(([key, value]) => [key, String(value)])
            )
        ).toString();

        
        const data = await api.get(session, `/api/meeting-rooms/search?${queryParams}`);
        
        return { success: true, data: data };

    } catch (error) {
        console.error("Server Action: Room search failed:", error);
        return { success: false, error: 'An error occurred while searching for rooms.' };
    }
}