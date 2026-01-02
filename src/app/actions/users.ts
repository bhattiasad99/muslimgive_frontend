'use server'

import { _get, _patch, _post } from "../lib/methods";
import { ChangePasswordPayload, ResponseType, UserProfile } from "../lib/definitions";

export type CreateMgMemberPayload = {
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth?: string;
    phoneNumber?: string;
    countryName?: string;
    city?: string;
    postalCode?: string;
    roles: string[];
}

export type UpdateUserRolesPayload = {
    add: string[];
    remove: string[];
}

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

/**
 * GET /users/me
 * Fetches the currently logged-in user's profile
 */
export const getMeAction = async (): Promise<ResponseType<UserProfile>> => {
    return await _get('/users/me');
}

/**
 * PATCH /users/change-password
 * Updates the user's password
 */
export const changePasswordAction = async (payload: ChangePasswordPayload): Promise<ResponseType> => {
    return await _patch('/users/change-password', payload);
}

/**
 * POST /admin/mg-member
 * Creates a new internal staff member
 */
export const createMgMemberAction = async (payload: CreateMgMemberPayload): Promise<ResponseType> => {
    return await _post('/admin/mg-member', payload);
}

/**
 * GET /users/{id}/roles
 * Fetches the roles for a specific user
 */
export const getUserRolesAction = async (userId: string): Promise<ResponseType> => {
    return await _get(`/users/${userId}/roles`);
}

/**
 * PATCH /roles/assign/{user_id}
 * Updates the roles for a specific user
 */
export const updateUserRolesAction = async (userId: string, payload: UpdateUserRolesPayload): Promise<ResponseType> => {
    return await _patch(`/roles/assign/${userId}`, payload);
}
