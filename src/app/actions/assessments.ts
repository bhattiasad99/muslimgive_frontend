'use server'

import { _post, _patch, _get } from "@/auth";
import { ResponseType } from "../lib/definitions";

export type SubmitAssessmentPayload = {
    charityId: string;
    coreArea: number;
    answers: Record<string, any>;
}

/**
 * POST /assessments/submissions/
 * Submits an assessment for a charity
 */
export const submitAssessmentAction = async (payload: SubmitAssessmentPayload): Promise<ResponseType> => {
    return await _post('/assessments/submissions/', payload);
}

export type CompleteAssessmentPayload = {
    charityId: string;
    coreArea: number;
}

/**
 * PATCH /assessments/submissions/complete
 * Marks an assessment submission as complete
 */
export const completeAssessmentAction = async (payload: CompleteAssessmentPayload): Promise<ResponseType> => {
    return await _patch('/assessments/submissions/complete', payload);
}

/**
 * GET /assessments/charities/{charityId}?core-area={coreArea}
 * Fetches saved/completed assessment data
 */
export const getAssessmentAction = async (charityId: string, coreArea: number): Promise<ResponseType> => {
    return await _get(`/assessments/charities/${charityId}?core-area=${coreArea}`);
}
