'use client'
import { CountryCode } from '@/app/(dashboard)/charities/[id]/assessments/[assessment]/page';
import { AssessmentStatus } from '@/DUMMY_ASSESSMENT_VALS';
import React, { FC, useEffect, useState } from 'react'
import PreviewValueLayout from '../../UI/PreviewValueLayout';
import LinkComponent from '@/components/common/LinkComponent';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import ModelComponentWithExternalControl from '@/components/common/ModelComponent/ModelComponentWithExternalControl';
import SubmittedSymbol from '../../Assessments/CoreArea1_CharityStatus/SubmittedSymbol';
import { submitAssessmentAction, completeAssessmentAction, getAssessmentAction } from '@/app/actions/assessments';
import { toast } from 'sonner';

export type PreviewPageCommonProps = {
    country: CountryCode;
    status: AssessmentStatus;
    charityId: string;
    fetchFromAPI?: boolean;
}

type IProps = PreviewPageCommonProps;


const PreviewCoreArea2: FC<IProps> = ({ country, status, charityId, fetchFromAPI = false }) => {
    void status;
    const [assessmentVals, setAssessmentVals] = useState<any>(null);
    const [showSubmittedModel, setShowSubmittedModel] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            if (fetchFromAPI) {
                try {
                    const res = await getAssessmentAction(charityId, 2);
                    if (res.ok && res.payload?.data?.data?.answers) {
                        setAssessmentVals(res.payload.data.data.answers);
                    } else {
                        console.error('Failed to fetch assessment data from API');
                    }
                } catch (error) {
                    console.error('Error fetching assessment data:', error);
                }
            } else {
                const stored = localStorage.getItem(`assessment-form-data-${charityId}-core-area-2`);
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
                coreArea: 2,
                answers: assessmentVals
            };

            const res = await submitAssessmentAction(payload);

            if (res.ok) {
                const completePayload = {
                    charityId,
                    coreArea: 2
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

    const getValue = (code: string) => assessmentVals[code];

    // Correct Codes based on core-area-2.ts:
    // F01: Assessmented financial statements available on website?
    // F02: Previous year assessmented financial statements available on website?
    // F03: Impact report with financial information available on website?
    // F04: % of Total Revenue spent on Charitable Programs...
    // F05: % of Total Revenue spent on Fundraising...
    // F06: % of Total Revenue spent on Administrative Expenses...
    // F07: % of Revenue Spent / Year Spent Revenue
    // F08: Financials (Link) - UK/US
    // F09: Tax Return (Link) - UK
    // F10: IRS Returns (Link) - US
    // F11: CRA's Returns (Link) - Canada
    // F12: End of fiscal year
    // F13: Charitable Registration since (Canada/UK/US?) - Checked ts, it's in all.
    // F15: Notes

    return (
        <div className='flex flex-col gap-4'>
            <PreviewValueLayout label='Assessmented financial statements available on website' result={`${getValue('F01') || '-'}`} />
            <PreviewValueLayout label='Previous year assessmented financial statements available on website' result={`${getValue('F02') || '-'}`} />
            <PreviewValueLayout label='Impact report with financial information available on website' result={`${getValue('F03') || '-'}`} />

            <PreviewValueLayout label='% of Total Revenue spent on Charitable Programs and Qualified Distributions' result={`${getValue('F04') || '-'}`} />
            <PreviewValueLayout label='% of Total Revenue spent on Fundraising' result={`${getValue('F05') || '-'}`} />
            <PreviewValueLayout label='% of Total Revenue spent on Administrative Expenses' result={`${getValue('F06') || '-'}`} />
            <PreviewValueLayout label='% of Revenue Spent / Year Spent Revenue' result={`${getValue('F07') || '-'}`} />

            {/* Financials Link (UK/US) */}
            {getValue('F08') && (
                <PreviewValueLayout label='Financials Link' result={
                    <LinkComponent openInNewTab className='hover:underline text-primary' to={getValue('F08')}>{getValue('F08')}</LinkComponent>
                } />
            )}

            {/* Tax Return Links (Varies by country) */}
            {getValue('F09') && (
                <PreviewValueLayout label='Tax Return Link (UK)' result={
                    <LinkComponent openInNewTab className='hover:underline text-primary' to={getValue('F09')}>{getValue('F09')}</LinkComponent>
                } />
            )}
            {getValue('F10') && (
                <PreviewValueLayout label='IRS Returns Link (US)' result={
                    <LinkComponent openInNewTab className='hover:underline text-primary' to={getValue('F10')}>{getValue('F10')}</LinkComponent>
                } />
            )}
            {getValue('F11') && (
                <PreviewValueLayout label="CRA's Returns Link (Canada)" result={
                    <LinkComponent openInNewTab className='hover:underline text-primary' to={getValue('F11')}>{getValue('F11')}</LinkComponent>
                } />
            )}

            <PreviewValueLayout label='End of fiscal year' result={`${getValue('F12') ? new Date(getValue('F12')).toLocaleDateString() : '-'}`} />

            {/* F13 exists in all definitions seen so far */}
            {getValue('F13') && (
                <PreviewValueLayout label='Charitable Registration since' result={`${new Date(getValue('F13')).toLocaleDateString()}`} />
            )}

            <PreviewValueLayout orientation='vertical' label='Notes' result={getValue('F15') || '-'} />

            <div className='flex flex-col gap-3 mb-8 sm:flex-row sm:items-center sm:gap-4'>
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
                        router.push(`/charities/${charityId}/assessments/core-area-2?country=${country}`)
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

export default PreviewCoreArea2
