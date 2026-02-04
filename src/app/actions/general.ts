'use server'
import { ResponseType } from "../lib/definitions";
import { _get } from "../lib/methods";

export const baseEndPoint = async (): Promise<ResponseType> => {
    const profileRes = await _get('/auth/session');
    return profileRes;
}

/**
 * GET /emails
 * Fetches all email logs
 */
export const getEmailsAction = async (): Promise<ResponseType> => {
    return await _get('/emails');
}
