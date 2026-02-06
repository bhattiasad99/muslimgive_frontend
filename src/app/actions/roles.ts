'use server'

import { _get, _delete, _post, _patch } from "@/auth";
import { ResponseType } from "../lib/definitions";

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
 */
export const listPermissionsAction = async (): Promise<ResponseType> => {
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
