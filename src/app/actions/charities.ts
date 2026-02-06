'use server'

import { _delete, _get, _getWithAccessToken, _patch, _post, getCookies } from "@/auth";
import { ResponseType } from "../lib/definitions";
import type { CountriesInKebab } from "@/components/common/CountrySelectComponent/countries.types";
import { unstable_cache } from 'next/cache';

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
    pendingEligibilitySource?: string;
}

/**
 * Payload for Creating a Charity
 */
export type CreateCharityPayload = {
    name: string;
    assessmentRequested: boolean;
    isIslamic: boolean;
    doesCharityGiveZakat: boolean;
    startDate?: string | null;
    startYear?: number | null;
    category: string;
    countryCode: CountriesInKebab;
    ukCharityNumber?: string | null;
    ukCharityCommissionUrl?: string | null;
    caRegistrationNumber?: string | null;
    caCraUrl?: string | null;
    usEin?: string | null;
    usIrsUrl?: string | null;
    ceoName: string;
    submittedByName: string;
    submittedByEmail: string;
    annualRevenue: number;
    isEligible: boolean;
}

/**
 * GET /charities
 * Lists all charities with pagination and filters
 */
export const listCharitiesAction = async (params: ListCharitiesParams, useCache = false): Promise<ResponseType> => {
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
    if (params.pendingEligibilitySource) {
        query.append('pendingEligibilitySource', params.pendingEligibilitySource);
    }

    const endpoint = `/charities?${query.toString()}`;

    // Cache pending eligibility count for dashboard (30 second cache)
    if (useCache && params.status?.includes('pending-eligibility') && params.limit === 1) {
        const { accessToken } = await getCookies();
        if (!accessToken) {
            return { ok: false, payload: null, unauthenticated: true, message: 'Unauthorized' };
        }
        const getCachedPendingCount = unstable_cache(
            async (token: string) => _getWithAccessToken(endpoint, token),
            ['pending-eligibility-count'],
            { revalidate: 30, tags: ['charities-pending'] }
        );
        return await getCachedPendingCount(accessToken);
    }

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
 * DELETE /charities/{id}
 * Deletes a charity
 */
export const deleteCharityAction = async (id: string): Promise<ResponseType> => {
    return await _delete(`/charities/${id}`);
}

/**
 * PATCH /charities/{charityId}/assignments
 * Assigns or removes roles for users in a charity
 */
export type AssignRolePayload = {
    userId: string;
    add?: string[];
    remove?: string[];
}[]

export const assignRolesToCharityAction = async (charityId: string, payload: AssignRolePayload): Promise<ResponseType> => {
    return await _patch(`/charities/${charityId}/assign`, { assignments: payload });
}

/**
 * PATCH /charities/{id}/eligibility
 * Manually update eligibility for a charity
 */
export type UpdateEligibilityPayload = {
    isEligible: boolean;
}

export const updateCharityEligibilityAction = async (charityId: string, payload: UpdateEligibilityPayload): Promise<ResponseType> => {
    return await _patch(`/charities/${charityId}/eligibility`, payload);
}

/**
 * POST /report
 * Sends bulk email to selected charities
 */
export type SendBulkEmailPayload = {
    charities: string[];
}

export const sendBulkEmailReportAction = async (payload: SendBulkEmailPayload): Promise<ResponseType> => {
    return await _post('/report', payload);
}

