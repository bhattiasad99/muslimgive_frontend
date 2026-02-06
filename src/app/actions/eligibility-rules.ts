'use server'

import { _get, _post } from '@/auth'
import { ResponseType } from '../lib/definitions'

export type EligibilityRulesPayload = {
    minYears: number
    minRevenue: number
    allowedCategories: string[]
    allowNonIslamic: boolean
}

export const getEligibilityRulesAction = async (): Promise<ResponseType> => {
    return await _get('/eligibility-rules')
}

export const saveEligibilityRulesAction = async (payload: EligibilityRulesPayload): Promise<ResponseType> => {
    return await _post('/eligibility-rules', payload)
}
