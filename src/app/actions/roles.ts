'use server'

import { _get, _delete, _post, _patch, _getWithAccessToken, authAdapter } from "@/auth";
import { ResponseType } from "../lib/definitions";
import { unstable_cache } from 'next/cache';

// Cached permissions - revalidate every 5 minutes since they rarely change
const getCachedPermissions = unstable_cache(
    async (token: string) => _getWithAccessToken('/roles/permissions', token),
    ['permissions-list'],
    { revalidate: 300, tags: ['permissions'] }
);

/**
 * GET /roles
 * Lists all available roles
 */
export const listRolesAction = async (): Promise<ResponseType> => {
    return await _get('/roles');
}

/**
 * GET /roles/permissions
 * Lists all available permissions (with implied permissions)
 * Uses caching for layout performance - revalidates every 5 minutes
 */
export const listPermissionsAction = async (useCache = false): Promise<ResponseType> => {
    if (useCache) {
        const accessToken = await authAdapter.getToken();
        if (!accessToken) {
            return { ok: false, payload: null, unauthenticated: true, message: 'Unauthorized' };
        }
        return await getCachedPermissions(accessToken);
    }
    return await _get('/roles/permissions');
}

/**
 * POST /roles
 * Creates a new role
 */
export type CreateRolePayload = {
    title: string;
    description?: string;
    permissions?: string[];
    rolePolicy?: string;
}

export const createRoleAction = async (payload: CreateRolePayload): Promise<ResponseType> => {
    return await _post('/roles', payload);
}

/**
 * PATCH /roles/{id}
 * Updates a role
 */
export type UpdateRolePayload = {
    title: string;
    description?: string;
}

export const updateRoleAction = async (id: string, payload: UpdateRolePayload): Promise<ResponseType> => {
    return await _patch(`/roles/${id}`, payload);
}

/**
 * PATCH /roles/{id}/permissions
 * Updates role permissions
 */
export type UpdateRolePermissionsPayload = {
    add?: string[];
    remove?: string[];
}

export const updateRolePermissionsAction = async (id: string, payload: UpdateRolePermissionsPayload): Promise<ResponseType> => {
    return await _patch(`/roles/${id}/permissions`, payload);
}

/**
 * DELETE /roles/{id}
 * Deletes a role
 */
export const deleteRoleAction = async (id: string): Promise<ResponseType> => {
    return await _delete(`/roles/${id}`);
}
