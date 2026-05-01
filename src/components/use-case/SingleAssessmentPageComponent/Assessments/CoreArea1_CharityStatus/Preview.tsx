'use client'
import { CountryCode } from '@/app/(dashboard)/charities/[id]/assessments/[assessment]/page'
import { AssessmentStatus } from '@/DUMMY_ASSESSMENT_VALS';
import React, { FC, useEffect, useState } from 'react'
import PreviewValueLayout from '../../UI/PreviewValueLayout';
import LinkComponent from '@/components/common/LinkComponent';
import { capitalizeWords } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import ModelComponentWithExternalControl from '@/components/common/ModelComponent/ModelComponentWithExternalControl';
import SubmittedSymbol from './SubmittedSymbol';
import { submitAssessmentAction, completeAssessmentAction, getAssessmentAction, editAssessmentAction } from '@/app/actions/assessments';
import { toast } from 'sonner';
import { CORE_AREA_1_FORMS } from '@/lib/assessment-forms/core-area-1';

export type PreviewPageCommonProps = {
    country: CountryCode;
    status: AssessmentStatus;
    charityId: string;
    fetchFromAPI?: boolean;
}

type IProps = PreviewPageCommonProps;

const PreviewCoreArea1: FC<IProps> = ({ country, status, charityId, fetchFromAPI = false }) => {
    const isEditMode = status === 'submitted' || status === 'completed';
    // We will load these from localStorage or API
    const [assessmentVals, setAssessmentVals] = useState<any>(null);
    const [showSubmittedModel, setShowSubmittedModel] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            if (fetchFromAPI) {
                // Fetch from API for assessment history
                try {
                    const res = await getAssessmentAction(charityId, 1);
                    if (res.ok && res.payload?.data?.data?.answers) {
                        const answers = res.payload.data.data.answers;
                        const { CORE_AREA_1_FORMS } = await import('@/lib/assessment-forms/core-area-1');

                        const countryMap: Record<string, string> = {
                            'united-kingdom': 'united-kingdom',
                            'united-states': 'united-states',
                            'canada': 'canada',
                            'uk': 'united-kingdom',
                            'usa': 'united-states',
                            'us': 'united-states',
                            'ca': 'canada'
                        };
                        const mappedCountry = countryMap[country] || 'united-kingdom';
                        const currentForm = CORE_AREA_1_FORMS.find(f => f.countryCode === mappedCountry) || CORE_AREA_1_FORMS[0];

                        const getPayloadKey = (code: string, label: string) => {
                            if (code === 'CS01') return 'charity_registration_number';
                            if (code === 'CS02') {
                                if (mappedCountry === 'united-states') return 'irs_profile_link';
                                if (mappedCountry === 'canada') return 'cra_profile_link';
                                return 'charity_commission_profile_link';
                            }
                            if (code === 'CS03') return 'registrationStatus';
                            if (code === 'CS04') {
                                if (mappedCountry === 'united-kingdom') return 'gift_aid_eligible';
                                return 'tax_deductible';
                            }
                            if (code === 'CS05' && mappedCountry !== 'united-kingdom') return 'evidence_for_pending_registration_provided';
                            if (code === 'CS06' && mappedCountry === 'united-kingdom') return 'evidence_for_pending_registration_provided';

                            if (code === 'CS07' && mappedCountry !== 'united-kingdom') return 'statusNotes';
                            if (code === 'CS08' && mappedCountry === 'united-kingdom') return 'statusNotes';

                            if (code === 'CS09') return 'registrationDate';
                            if (code === 'CS11') return 'statusEvidenceLink';

                            return label.toLowerCase().replace(/[()]/g, '').trim().replace(/\s+/g, '_');
                        };

                        const toLegacyKey = (label: string) => label.toLowerCase().replace(/[()]/g, '').replace(/\//g, ' ').trim().replace(/\s+/g, '_');
                        const normalizeKey = (k: string) => k.toLowerCase().replace(/[-_]/g, '');

                        const findRobustAnswer = (code: string, label: string, answersObj: Record<string, any>) => {
                            const exactKey = getPayloadKey(code, label);
                            const legacyKey = toLegacyKey(label);

                            // Exact match first
                            if (answersObj[exactKey] !== undefined) return answersObj[exactKey];
                            if (answersObj[legacyKey] !== undefined) return answersObj[legacyKey];

                            // Normalized fallback
                            const normExact = normalizeKey(exactKey);
                            const normLeg = normalizeKey(legacyKey);
                            const normCharityNumber = normalizeKey('charity_number');
                            const normEin = normalizeKey('ein_employer_id_number');
                            const normUkLink = normalizeKey('charity_commission_profile_link');

                            for (const [k, v] of Object.entries(answersObj)) {
                                const normK = normalizeKey(k);
                                if (normK === normExact || normK === normLeg ||
                                    (code === 'CS01' && (normK === normCharityNumber || normK === normEin))) {
                                    return v;
                                }
                                // Special fallback for Profile Link in US and Canada
                                if (code === 'CS02' && (mappedCountry === 'united-states' || mappedCountry === 'canada') && normK === normUkLink) {
                                    return v;
                                }
                            }
                            return undefined;
                        };

                        const mappedAnswers: any = {};
                        currentForm.questions.forEach(q => {
                            const ans = findRobustAnswer(q.code, q.label, answers);

                            if (ans !== undefined && ans !== null) {
                                mappedAnswers[q.code] = ans;
                            }
                        });

                        setAssessmentVals(mappedAnswers);
                    } else {
                        console.error('Failed to fetch assessment data from API');
                    }
                } catch (error) {
                    console.error('Error fetching assessment data:', error);
                }
            } else {
                // Fetch from localStorage for editing mode
                const stored = localStorage.getItem(`assessment-form-data-${charityId}-core-area-1`);
                if (stored) {
                    try {
                        setAssessmentVals(JSON.parse(stored));
                    } catch (e) {
                        console.error("Failed to parse stored assessment data", e);
                    }
                }
            }
        };

        fetchData();
    }, [charityId, fetchFromAPI, country]);

    const handleSubmit = async () => {
        if (!assessmentVals) return;
        console.log('[PreviewCoreArea1] handleSubmit triggered. isEditMode:', isEditMode);
        
        try {
            const normalizedCountry = country as 'united-kingdom' | 'united-states' | 'canada';

            const getPayloadKey = (code: string, label: string) => {
                if (code === 'CS03') return 'registrationStatus';
                
                // Registration Number / Link (Conditional based on country)
                if (code === 'CS01' && normalizedCountry === 'united-kingdom') return 'charity_registration_number';
                if (code === 'CS02' && normalizedCountry !== 'united-kingdom') return 'charity_registration_number'; // Canada/US
                if (code === 'CS01' && normalizedCountry !== 'united-kingdom') return 'cra_profile_link';
                if (code === 'CS02' && normalizedCountry === 'united-kingdom') return 'cra_profile_link';
    
                if (code === 'CS04') {
                    return 'tax_deductible';
                }
                if (code === 'CS05' && normalizedCountry !== 'united-kingdom') return 'evidence_for_pending_registration_provided';
                if (code === 'CS06' && normalizedCountry === 'united-kingdom') return 'evidence_for_pending_registration_provided';
                
                if (code === 'CS07' && normalizedCountry !== 'united-kingdom') return 'statusNotes';
                if (code === 'CS08' && normalizedCountry === 'united-kingdom') return 'statusNotes';
                
                if (code === 'CS09') return 'registrationDate';
                if (code === 'CS11') return 'statusEvidenceLink';
                
                return label.toLowerCase().replace(/[()]/g, '').trim().replace(/\s+/g, '_');
            };

            const mappedAnswers: Record<string, any> = {};
            const currentFormDef = CORE_AREA_1_FORMS.find(f => f.countryCode === normalizedCountry);
            const questions = currentFormDef?.questions || [];

            if (assessmentVals) {
                Object.entries(assessmentVals).forEach(([code, val]) => {
                    const q = questions.find((question: any) => question.code === code);
                    if (q) {
                        const key = getPayloadKey(q.code, q.label);
                        mappedAnswers[key] = val;
                    }
                });
            }

            const payload = {
                charityId,
                coreArea: 1,
                answers: mappedAnswers
            };
            console.log('[PreviewCoreArea1] Sending Payload:', JSON.stringify(payload, null, 2));

            const res = isEditMode
                ? await editAssessmentAction(payload)
                : await submitAssessmentAction(payload);
            
            console.log('[PreviewCoreArea1] API Response:', JSON.stringify(res, null, 2));

            if (res.ok) {
                // If it's a new submission, we also need to complete it
                if (!isEditMode) {
                    const completePayload = {
                        charityId,
                        coreArea: 1,
                        answers: assessmentVals
                    };
                    const completeRes = await completeAssessmentAction(completePayload);

                    if (!completeRes.ok) {
                        toast.error(completeRes.message || "Failed to complete assessment");
                        setIsSubmitting(false);
                        return;
                    }
                }
                
                setShowSubmittedModel(true);

                setTimeout(() => {
                    setShowSubmittedModel(false);
                    router.push(`/charities/${charityId}`)
                }, 2000)
            } else {
                toast.error(res.message || "Failed to submit assessment");
            }
        } catch (error) {
            console.error("An error occurred during submission:", error);
            toast.error("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (!assessmentVals) {
        return <div>Loading preview...</div>
    }

    // Helper to extract values safely since keys might match form codes (CS01 etc)
    // We assume the stored data is { CS01: 'value', CS02: 'value', ... }
    // But the display below expects specific fields. 
    // We need to map the form codes to the display labels if we want to reuse the exact layout.
    // However, the previous Preview.tsx used DUMMY_AUDIT_VALUES which had nice property names.
    // The formData from index.tsx has keys like 'CS01', 'CS02'.
    // We either need to map them here OR update index.tsx to save with nice names.
    // Mapping here is safer as index.tsx generates form based on JSON config.

    // Mapping based on CORE_AREA_1_FORMS structure (simplified for this task):
    // CS01: Charity Number
    // CS02: Charity Commission Profile URL
    // CS03: Registration Status
    // CS04: Status Evidence (File/Link)
    // CS05: Gift Aid Eligibility (Yes/No)
    // CS06: Link to Gift Aid status
    // CS07: Status Notes

    // Note: The codes might vary by country but let's assume standard for now or check.

    const getValue = (code: string) => assessmentVals[code];
    const isUk = country === 'united-kingdom';
    const isUs = country === 'united-states';

    const getFieldCode = (field: 'giftAid' | 'notes') => {
        if (isUk) {
            return {
                giftAid: 'CS04',
                notes: 'CS08'
            }[field];
        } else {
            // US and Canada
            return {
                giftAid: 'CS04',
                notes: 'CS07'
            }[field];
        }
    };

    const getLabel = (field: 'giftAid' | 'notes') => {
        if (isUk) {
            return {
                giftAid: 'Gift Aid Eligibility',
                notes: 'Status Notes'
            }[field];
        } else {
            return {
                giftAid: 'Tax-Deductible',
                notes: 'Status Notes'
            }[field];
        }
    };

    return (
        <div className='flex flex-col gap-4'>

            <PreviewValueLayout label={isUk ? 'Charity Number' : isUs ? 'EIN' : 'Charity Registration Number'} result={`${getValue('CS01') || '-'}`} />

            <PreviewValueLayout label={isUk ? 'Charity Commission Profile URL' : isUs ? 'IRS Profile Link' : 'CRA Profile Link'} result={
                getValue('CS02') ? <LinkComponent openInNewTab className='hover:underline text-primary' to={getValue('CS02')}>{getValue('CS02')}</LinkComponent> : '-'
            } />

            <PreviewValueLayout label="Registration Status" result={
                <span className='flex flex-col gap-2 items-start sm:flex-row sm:items-center'>
                    <span>{capitalizeWords(getValue('CS03') || '-')}</span>

                    {/* Registration Date & Evidence Link (if 'Registered' or 'Pending Registration') */}
                    {(getValue('CS03') === 'Pending Registration' || getValue('CS03') === 'Registered') && (
                        <div className="flex flex-col gap-1 text-xs text-muted-foreground sm:ml-4 sm:border-l pl-0 sm:pl-4 mt-2 sm:mt-0">
                            {getValue('CS09') && <div>Date: {new Date(getValue('CS09')).toLocaleDateString()}</div>}
                            {getValue('CS11') && <div>Link: <LinkComponent openInNewTab to={getValue('CS11')} className="underline">{getValue('CS11')}</LinkComponent></div>}
                        </div>
                    )}
                </span>
            } />

            {/* Evidence for Pending Registration Provided (Yes/No) */}
            {getValue('CS03') === 'Pending Registration' && (
                <PreviewValueLayout
                    label="Evidence for Pending Registration Provided"
                    result={`${getValue(isUk ? 'CS06' : 'CS05') || '-'}`}
                />
            )}

            <PreviewValueLayout label={getLabel('giftAid')!} result={`${getValue(getFieldCode('giftAid')!) || '-'}`} />

            {/* Link to Gift Aid status is ONLY for UK (CS05) */}
            {isUk && (
                <PreviewValueLayout label="Link to Gift Aid Status" result={
                    getValue('CS05') ? <LinkComponent openInNewTab className='hover:underline text-primary' to={getValue('CS05')}>{getValue('CS05')}</LinkComponent> : '-'
                } />
            )}

            <PreviewValueLayout label={getLabel('notes')!} result={getValue(getFieldCode('notes')!) || '-'} />

            <div className='flex flex-col gap-3 mb-8 sm:flex-row sm:items-center sm:gap-4'>
                {!fetchFromAPI && (
                    <Button
                        className="w-full sm:w-36 bg-[#266dd3] hover:bg-[#1f5bb5]"
                        onClick={handleSubmit}
                        loading={isSubmitting}
                    >
                        {isEditMode ? 'Submit Edit' : 'Submit Assessment'}
                    </Button>
                )}
                <Button
                    className="w-full sm:w-36"
                    variant={'outline'}
                    onClick={() => {
                        // Go back to edit mode
                        // Remove preview-mode=true param
                        router.push(`/charities/${charityId}/assessments/core-area-1?country=${country}`)
                    }}
                >
                    {fetchFromAPI ? 'Edit' : 'Cancel'}
                </Button>
            </div>

            <ModelComponentWithExternalControl open={showSubmittedModel} title='' onOpenChange={(openState) => setShowSubmittedModel(openState)}>
                <div className="flex flex-col gap-2 items-center">
                    <SubmittedSymbol />
                    <div className='font-semibold'>Assessment Completed!</div>
                    <div className="text-sm">Navigating back to the Charity Page</div>
                </div>
            </ModelComponentWithExternalControl>
        </div>
    )
}

export default PreviewCoreArea1
