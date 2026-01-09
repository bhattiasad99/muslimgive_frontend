'use server'

import { _post, _patch, _get } from "../lib/methods";
import { ResponseType } from "../lib/definitions";

export type SubmitAuditPayload = {
    charityId: string;
    coreArea: number;
    answers: Record<string, any>;
}

/**
 * POST /audits/submissions/
 * Submits an audit for a charity
 */
export const submitAuditAction = async (payload: SubmitAuditPayload): Promise<ResponseType> => {
    return await _post('/audits/submissions/', payload);
}

export type CompleteAuditPayload = {
    charityId: string;
    coreArea: number;
}

/**
 * PATCH /audits/submissions/complete
 * Marks an audit submission as complete
 */
export const completeAuditAction = async (payload: CompleteAuditPayload): Promise<ResponseType> => {
    return await _patch('/audits/submissions/complete', payload);
}

/**
 * GET /audits/charities/{charityId}?core-area={coreArea}
 * Fetches saved/completed audit data
 */
export const getAuditAction = async (charityId: string, coreArea: number): Promise<ResponseType> => {
    return await _get(`/audits/charities/${charityId}?core-area=${coreArea}`);
}
