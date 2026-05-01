'use client'
import { CountryCode } from '@/app/(dashboard)/charities/[id]/assessments/[assessment]/page';
import { AssessmentStatus } from '@/DUMMY_ASSESSMENT_VALS';
import React, { FC, useEffect, useState, useMemo } from 'react'
import PreviewValueLayout from '../../UI/PreviewValueLayout';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import ModelComponentWithExternalControl from '@/components/common/ModelComponent/ModelComponentWithExternalControl';
import SubmittedSymbol from '../../Assessments/CoreArea1_CharityStatus/SubmittedSymbol';
import { submitAssessmentAction, completeAssessmentAction, getAssessmentAction, editAssessmentAction } from '@/app/actions/assessments';
import { toast } from 'sonner';
import { CORE_AREA_4_FORMS } from '@/lib/assessment-forms/core-area-4';

export type PreviewPageCommonProps = {
    country: CountryCode;
    status: AssessmentStatus;
    charityId: string;
    fetchFromAPI?: boolean;
}

type IProps = PreviewPageCommonProps;

const PreviewCoreArea4: FC<IProps> = ({ country, status, charityId, fetchFromAPI = false }) => {
    const isEditMode = status === 'submitted' || status === 'completed';
    const [assessmentVals, setAssessmentVals] = useState<Record<string, string> | null>(null);
    const [showSubmittedModel, setShowSubmittedModel] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const currentForm = useMemo(() => {
        const countryMap: Record<string, 'united-kingdom' | 'united-states' | 'canada'> = {
            'united-kingdom': 'united-kingdom',
            'united-states': 'united-states',
            'canada': 'canada',
            'uk': 'united-kingdom',
            'usa': 'united-states',
            'us': 'united-states',
            'ca': 'canada'
        };
        // Safely handle if country is undefined or not in map, default to uk
        const mappedCountry = (country && countryMap[country]) ? countryMap[country] : 'united-kingdom';
        return CORE_AREA_4_FORMS.find(f => f.countryCode === mappedCountry) || CORE_AREA_4_FORMS[0];
    }, [country]);

    useEffect(() => {
        const fetchData = async () => {
            if (fetchFromAPI) {
                try {
                    const res = await getAssessmentAction(charityId, 4);
                    if (res.ok && res.payload?.data?.data?.answers) {
                        const answers = res.payload.data.data.answers;

                        const toSnakeCase = (str: string) =>
                            str.toLowerCase()
                                .replace(/[?]/g, '') // remove question marks
                                .replace(/[()]/g, '')
                                .replace(/['’]/g, '') // remove apostrophes
                                .trim()
                                .replace(/\s+/g, '_');

                        const mappedAnswers: Record<string, string> = {};
                        currentForm.questions.forEach(q => {
                            const key = toSnakeCase(q.label);
                            const ans = answers[key];
                            if (ans !== undefined && ans !== null) {
                                // API returns snake_case (e.g. "yes"), but form options are Title Case (e.g. "Yes")
                                // Find the matching option by converting option label to snake_case
                                const matchingOption = q.options.find(opt => toSnakeCase(opt.label) === ans);
                                if (matchingOption) {
                                    mappedAnswers[q.code] = matchingOption.label;
                                } else {
                                    mappedAnswers[q.code] = ans;
                                }
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
                const stored = localStorage.getItem(`assessment-form-data-${charityId}-core-area-4`);
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
    }, [charityId, fetchFromAPI]);

    const handleSubmit = async () => {
        if (!assessmentVals) return;
        console.log('[PreviewCoreArea4] handleSubmit triggered. isEditMode:', isEditMode);
        try {
            const toSnakeCaseConverted = (str: string) =>
                str.toLowerCase()
                    .replace(/[?]/g, '')
                    .replace(/[()]/g, '')
                    .replace(/['’]/g, '')
                    .trim()
                    .replace(/\s+/g, '_');

            const mappedAnswers: Record<string, any> = {};
            const normalizedCountry = country as 'united-kingdom' | 'united-states' | 'canada';
            
            const currentFormDef = CORE_AREA_4_FORMS.find(f => f.countryCode === normalizedCountry);
            const questions = currentFormDef?.questions || [];

            if (assessmentVals) {
                Object.entries(assessmentVals).forEach(([code, val]) => {
                    const q = questions.find((question: any) => question.code === code);
                    if (q) {
                        const key = toSnakeCaseConverted(q.label);
                        // Convert value to snake_case as well (e.g. "Yes" -> "yes", "3 or more" -> "3_or_more")
                        mappedAnswers[key] = toSnakeCaseConverted(val);
                    }
                });
            }

            const payload = {
                charityId,
                coreArea: 4,
                answers: mappedAnswers
            };
            console.log('[PreviewCoreArea4] Sending Payload:', JSON.stringify(payload, null, 2));

            const res = isEditMode
                ? await editAssessmentAction(payload)
                : await submitAssessmentAction(payload);
            
            console.log('[PreviewCoreArea4] API Response:', JSON.stringify(res, null, 2));

            if (res.ok) {
                if (!isEditMode) {
                    const completePayload = {
                        charityId,
                        coreArea: 4
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

    return (
        <div className='flex flex-col gap-4'>
            {currentForm.questions.map(question => {
                const answer = assessmentVals[question.code];
                return (
                    <PreviewValueLayout
                        key={question.id}
                        label={question.label}
                        result={answer || '-'}
                    />
                );
            })}

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
                        if (fetchFromAPI) {
                            router.push(`/charities/${charityId}/assessments/core-area-4?country=${country}`)
                        } else {
                            router.push(`/charities/${charityId}/assessments/core-area-4?preview-mode=false&country=${country}`)
                        }
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

export default PreviewCoreArea4
