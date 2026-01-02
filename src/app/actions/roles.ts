'use server'

import { _get, _delete } from "../lib/methods";
import { ResponseType } from "../lib/definitions";

/**
 * GET /roles
 * Lists all available roles
 */
export const listRolesAction = async (): Promise<ResponseType> => {
    return await _get('/roles');
}

/**
 * DELETE /roles/{id}
 * Deletes a role
 */
export const deleteRoleAction = async (id: string): Promise<ResponseType> => {
    return await _delete(`/roles/${id}`);
}
