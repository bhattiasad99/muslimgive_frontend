'use client'
import { CountryCode } from '@/app/(dashboard)/charities/[id]/audits/[audit]/page';
import { AuditStatus } from '@/DUMMY_AUDIT_VALS';
import React, { FC, useEffect, useState } from 'react'
import PreviewValueLayout from '../../UI/PreviewValueLayout';
import LinkComponent from '@/components/common/LinkComponent';
import { capitalizeWords } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';
import ModelComponentWithExternalControl from '@/components/common/ModelComponent/ModelComponentWithExternalControl';
import SubmittedSymbol from '../../Audits/CoreArea1_CharityStatus/SubmittedSymbol';
import { submitAuditAction, completeAuditAction, getAuditAction } from '@/app/actions/audits';
import { toast } from 'sonner';

export type PreviewPageCommonProps = {
    country: CountryCode;
    status: AuditStatus;
    charityId: string;
    fetchFromAPI?: boolean;
}

type IProps = PreviewPageCommonProps;


const PreviewCoreArea2: FC<IProps> = ({ country, status, charityId, fetchFromAPI = false }) => {
    const [auditVals, setAuditVals] = useState<any>(null);
    const [showSubmittedModel, setShowSubmittedModel] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const fetchData = async () => {
            if (fetchFromAPI) {
                try {
                    const res = await getAuditAction(charityId, 2);
                    if (res.ok && res.payload?.data?.data?.answers) {
                        setAuditVals(res.payload.data.data.answers);
                    } else {
                        console.error('Failed to fetch audit data from API');
                    }
                } catch (error) {
                    console.error('Error fetching audit data:', error);
                }
            } else {
                const stored = localStorage.getItem(`audit-form-data-${charityId}-core-area-2`);
                if (stored) {
                    try {
                        setAuditVals(JSON.parse(stored));
                    } catch (e) {
                        console.error("Failed to parse stored audit data", e);
                    }
                }
            }
        };

        fetchData();
    }, [charityId, fetchFromAPI]);

    const handleSubmit = async () => {
        if (!auditVals) return;
        setIsSubmitting(true);
        try {
            const payload = {
                charityId,
                coreArea: 2,
                answers: auditVals
            };

            const res = await submitAuditAction(payload);

            if (res.ok) {
                const completePayload = {
                    charityId,
                    coreArea: 2
                };
                const completeRes = await completeAuditAction(completePayload);

                if (completeRes.ok) {
                    setShowSubmittedModel(true);

                    setTimeout(() => {
                        setShowSubmittedModel(false);
                        router.push(`/charities/${charityId}`)
                    }, 2000)
                } else {
                    toast.error(completeRes.message || "Failed to complete audit");
                }
            } else {
                toast.error(res.message || "Failed to submit audit");
            }
        } catch (error) {
            console.error("An error occurred during submission:", error);
            toast.error("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (!auditVals) {
        return <div>Loading preview...</div>
    }

    const getValue = (code: string) => auditVals[code];

    // Correct Codes based on core-area-2.ts:
    // F01: Audited financial statements available on website?
    // F02: Previous year audited financial statements available on website?
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
            <PreviewValueLayout label='Audited financial statements available on website' result={`${getValue('F01') || '-'}`} />
            <PreviewValueLayout label='Previous year audited financial statements available on website' result={`${getValue('F02') || '-'}`} />
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
                    Submit Audit
                </Button>
                <Button
                    className="w-full sm:w-36"
                    variant={'outline'}
                    onClick={() => {
                        router.push(`/charities/${charityId}/audits/core-area-2?country=${country}`)
                    }}
                >
                    Cancel
                </Button>
            </div>

            <ModelComponentWithExternalControl open={showSubmittedModel} title='' onOpenChange={(openState) => setShowSubmittedModel(openState)}>
                <div className="flex flex-col gap-2 items-center">
                    <SubmittedSymbol />
                    <div className='font-semibold'>Audit Completed!</div>
                    <div className="text-sm">Navigating back to the Charity Page</div>
                </div>
            </ModelComponentWithExternalControl>
        </div>
    )
}

export default PreviewCoreArea2