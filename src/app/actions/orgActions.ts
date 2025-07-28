'use server'; 

import { revalidateTag } from 'next/cache';
import { api } from '@/lib/apiClient';

interface OrgFormData {
    name: string;
    plan_id: string;
}

export async function saveOrganization(formData: OrgFormData, orgId?: string) {
    try {
        if (orgId) {
            await api.patch(session, `/api/admin/orgs/${orgId}`, formData);
        } else {
            await api.post(session, '/api/admin/orgs', formData);
        }

        revalidateTag('orgs');

        return { success: true, message: `Organization ${orgId ? 'updated' : 'created'} successfully!` };

    } catch (error) {
        console.error("Save organization failed:", error);
       
        return { success: false, message: 'An error occurred on the server. Please try again.' };
    }
}

export async function addUserToOrg(userId: string, orgId: string) {
    if (!userId || !orgId) {
        return { success: false, message: 'User ID and Organization ID are required.' };
    }
    try {
        
        await api.patch(session, `/api/admin/users/add-to-org/${userId}`, { organization_id: orgId });

        revalidateTag('users');
        revalidateTag('orgs');

        return { success: true };
    } catch (error) {
        console.error("Add user to org failed:", error);
        return { success: false, message: 'An error occurred on the server.' };
    }
}


export async function setOrgAdmin(orgId: string, userId: string) {
    if (!orgId || !userId) {
        return { success: false, message: 'Organization ID and User ID are required.' };
    }

    try {
        await api.post(session, `/api/admin/orgs/${orgId}/set-admin`, { user_id: userId });

        revalidateTag('orgs');

        return { success: true, message: 'Organization admin updated successfully!' };

    } catch (error) {
        console.error("Set org admin failed:", error);
        return { success: false, message: 'An error occurred while setting the admin.' };
    }
}


export async function assignCreditsToOrg(orgId: string, creditsToAssign: number) {
    if (!orgId || !creditsToAssign || creditsToAssign <= 0) {
        return { success: false, message: 'Invalid organization ID or credit amount.' };
    }

    try {
        const result = await api.post(session, `/api/admin/assign-credits/${orgId}`, { creditsToAssign });

        revalidateTag('orgs');

        return { success: true, message: result.message || 'Credits assigned successfully!' };

    } catch (error) {
        console.error("Assign credits failed:", error);
        return { success: false, message: 'An error occurred while assigning credits.' };
    }
}


export async function removeUserFromOrg(userId: string) {
    if (!userId) {
        return { success: false, message: 'User ID is required.' };
    }
    
    try {
        
        await api.delete(session, `/api/admin/users/remove-from-org/${userId}`);

        
        revalidateTag('users');
        revalidateTag('orgs');

        return { success: true };

    } catch (error) {
        console.error("Remove user from org failed:", error);
        return { success: false, message: 'An error occurred while removing the user.' };
    }
}
 
export async function updateOrgProfileAction(formData: FormData) {
    try {
        console.log("formData")
        console.log(formData)
        const result = await api.patch(session, '/api/orgs/profile', formData);
        revalidateTag('org-profile');
        return { success: true, message: 'Organization profile updated successfully!', data: result };
    } catch (error: any) {
        try {
            const errorBody = JSON.parse(error.message);
            return { success: false, message: errorBody.message || 'Failed to update profile.' };
        } catch (e) {
            return { success: false, message: 'A server error occurred.' };
        }
    }
}

export async function cancelOrgSubscriptionAction(orgId: string) {
    if (!orgId) {
        return { success: false, message: 'Organization ID is required.' };
    }
    try {
        const result = await api.delete(session, `/api/admin/orgs/${orgId}/plan`);
        revalidateTag('orgs');
        revalidateTag(`org-detail-${orgId}`);
        return { success: true, message: result.message || 'Plan cancelled successfully.' };
    } catch (error: any) {
        try {
            const errorBody = JSON.parse(error.message);
            return { success: false, message: errorBody.message || 'Failed to cancel plan.' };
        } catch (e) {
            return { success: false, message: 'A server error occurred.' };
        }
    }
}
