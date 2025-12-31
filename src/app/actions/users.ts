'use server'

import { _get } from "../lib/methods";
import { ResponseType } from "../lib/definitions";

/**
 * Filter Params for List Users
 * (Inferred from standard practices as precise docs were not provided for listing params)
 */
export type ListUsersParams = {
    page?: number;
    limit?: number;
    search?: string;
    role?: string; 
}

/**
 * GET /admin/users
 * Lists all users. Useful for role assignment search.
 */
export const listUsersAction = async (params?: ListUsersParams): Promise<ResponseType> => {
    const query = new URLSearchParams();
    
    // Although the user query showed no params, typically listing endpoints support at least searching
    // Adding basics here securely. If backend ignores them, no harm done.
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.search) query.append('search', params.search);
    if (params?.role) query.append('role', params.role); // e.g., 'project-manager'

    const endpoint = `/admin/users?${query.toString()}`;
    return await _get(endpoint);
}
