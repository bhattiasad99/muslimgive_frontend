'use client'
import { CountryCode } from '@/app/(dashboard)/charities/[id]/assessments/[assessment]/page';
import { AssessmentStatus } from '@/DUMMY_ASSESSMENT_VALS';
import React, { FC, useEffect, useState, useMemo } from 'react'
import PreviewValueLayout from '../../UI/PreviewValueLayout';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import ModelComponentWithExternalControl from '@/components/common/ModelComponent/ModelComponentWithExternalControl';
import SubmittedSymbol from '../../Assessments/CoreArea1_CharityStatus/SubmittedSymbol';
import { submitAssessmentAction, completeAssessmentAction, getAssessmentAction } from '@/app/actions/assessments';
import { toast } from 'sonner';
import { CORE_AREA_4_FORMS } from '@/lib/assessment-forms/core-area-4';

export type PreviewPageCommonProps = {
    country: CountryCode;
    status: AssessmentStatus;
    charityId: string;
    fetchFromAPI?: boolean;
}

type IProps = PreviewPageCommonProps;

const PreviewCoreArea4: FC<IProps> = ({ country, charityId, fetchFromAPI = false }) => {
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
                        setAssessmentVals(res.payload.data.data.answers);
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
        setIsSubmitting(true);
        try {
            const payload = {
                charityId,
                coreArea: 4,
                answers: assessmentVals
            };

            const res = await submitAssessmentAction(payload);

            if (res.ok) {
                const completePayload = {
                    charityId,
                    coreArea: 4
                };
                const completeRes = await completeAssessmentAction(completePayload);

                if (completeRes.ok) {
                    setShowSubmittedModel(true);

                    setTimeout(() => {
                        setShowSubmittedModel(false);
                        router.push(`/charities/${charityId}`)
                    }, 2000)
                } else {
                    toast.error(completeRes.message || "Failed to complete assessment");
                }
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

            <div className='flex flex-col gap-3 mb-8 sm:flex-row sm:items-center sm:gap-4 mt-8'>
                <Button
                    className="w-full sm:w-36 bg-[#266dd3] hover:bg-[#1f5bb5]"
                    onClick={handleSubmit}
                    loading={isSubmitting}
                >
                    Submit Assessment
                </Button>
                <Button
                    className="w-full sm:w-36"
                    variant={'outline'}
                    onClick={() => {
                        router.push(`/charities/${charityId}/assessments/core-area-4?country=${country}`)
                    }}
                >
                    Cancel
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
