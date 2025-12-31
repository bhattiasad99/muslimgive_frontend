'use server'

import { _delete, _get, _patch, _post } from "../lib/methods";
import { ResponseType } from "../lib/definitions";

/**
 * Filter and Pagination Params for List Charities
 */
export type ListCharitiesParams = {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: 'createdAt' | 'name' | 'updatedAt';
    order?: 'ASC' | 'DESC';
    status?: string[];
    isActive?: boolean;
    startDate?: string;
    endDate?: string;
    createdByUserId?: string;
    doesCharityGiveZakat?: boolean;
    isIslamic?: boolean;
    categories?: string[];
}

/**
 * Payload for Creating a Charity
 */
export type CreateCharityPayload = {
    name: string;
    isIslamic: boolean;
    doesCharityGiveZakat: boolean;
    description: string;
    charityCommissionWebsiteUrl: string;
    startDate: string;
    category: string;
}

/**
 * Payload for Eligibility Test
 */
export type EligibilityTestPayload = {
    startDate: string;
    doesCharityGiveZakat: boolean;
    isIslamic: boolean;
    category: string;
}

/**
 * GET /charities
 * Lists all charities with pagination and filters
 */
export const listCharitiesAction = async (params: ListCharitiesParams): Promise<ResponseType> => {
    const query = new URLSearchParams();
    
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.search) query.append('search', params.search);
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.order) query.append('order', params.order);
    if (params.isActive !== undefined) query.append('isActive', params.isActive.toString());
    if (params.startDate) query.append('startDate', params.startDate);
    if (params.endDate) query.append('endDate', params.endDate);
    if (params.createdByUserId) query.append('createdByUserId', params.createdByUserId);
    if (params.doesCharityGiveZakat !== undefined) query.append('doesCharityGiveZakat', params.doesCharityGiveZakat.toString());
    if (params.isIslamic !== undefined) query.append('isIslamic', params.isIslamic.toString());
    
    if (params.status && params.status.length > 0) {
        query.append('status', params.status.join(','));
    }
    
    if (params.categories && params.categories.length > 0) {
        query.append('categories', params.categories.join(','));
    }

    const endpoint = `/charities?${query.toString()}`;
    return await _get(endpoint);
}

/**
 * GET /charities/{id}
 * Fetches a single charity by ID
 */
export const getCharityAction = async (id: string): Promise<ResponseType> => {
    return await _get(`/charities/${id}`);
}

/**
 * POST /charities
 * Creates a new charity
 */
export const createCharityAction = async (payload: CreateCharityPayload): Promise<ResponseType> => {
    return await _post('/charities', payload);
}

/**
 * PATCH /charities/{charity_id}/eligibility
 * Performs an eligibility test for a charity
 */
export const performEligibilityTestAction = async (charityId: string, payload: EligibilityTestPayload): Promise<ResponseType> => {
    return await _patch(`/charities/${charityId}/eligibility`, payload);
}

/**
 * DELETE /charities/{id}
 * Deletes a charity
 */
export const deleteCharityAction = async (id: string): Promise<ResponseType> => {
    return await _delete(`/charities/${id}`);
}
