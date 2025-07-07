'use server';

import { revalidateTag } from 'next/cache';
import { api } from '@/lib/apiClient';

interface PlanFormData {
    name: string;
    plan_credits: number;
    price: number;
}


export async function savePlan(formData: PlanFormData, planId?: string) {
    try {
        if (planId) {
            await api.patch(`/api/admin/plans/${planId}`, formData);
        } else {
            await api.post('/api/admin/plans', formData);
        }
        revalidateTag('plans'); 
        
        return { success: true, message: `Plan ${planId ? 'updated' : 'created'} successfully.` };
    } catch (error) {
        console.error("Save plan failed:", error);
        return { success: false, message: 'An error occurred on the server.' };
    }
}


export async function deletePlan(planId: string) {
    if (!planId) {
        return { success: false, message: 'Plan ID is required.' };
    }
    try {
        await api.delete(`/api/admin/plans/${planId}`);
        revalidateTag('plans');
        return { success: true };
    } catch (error) {
        console.error("Delete plan failed:", error);
        
        if (error instanceof Error && error.message.includes('409')) {
             return { success: false, message: 'Cannot delete plan. It is currently assigned to one or more organizations.' };
        }
        return { success: false, message: 'An error occurred while deleting the plan.' };
    }
}