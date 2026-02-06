'use client'
import { CountryCode } from '@/app/(dashboard)/charities/[id]/audits/[audit]/page'
import { AuditStatus } from '@/DUMMY_AUDIT_VALS';
import React, { FC, useEffect, useState } from 'react'
import PreviewValueLayout from '../../UI/PreviewValueLayout';
import LinkComponent from '@/components/common/LinkComponent';
import { capitalizeWords } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';
import ModelComponentWithExternalControl from '@/components/common/ModelComponent/ModelComponentWithExternalControl';
import SubmittedSymbol from './SubmittedSymbol';
import { submitAuditAction, completeAuditAction, getAuditAction } from '@/app/actions/audits';
import { toast } from 'sonner';

export type PreviewPageCommonProps = {
    country: CountryCode;
    status: AuditStatus;
    charityId: string;
    fetchFromAPI?: boolean;
}

type IProps = PreviewPageCommonProps;

const PreviewCoreArea1: FC<IProps> = ({ country, status, charityId, fetchFromAPI = false }) => {
    // We will load these from localStorage or API
    const [auditVals, setAuditVals] = useState<any>(null);
    const [showSubmittedModel, setShowSubmittedModel] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const fetchData = async () => {
            if (fetchFromAPI) {
                // Fetch from API for audit history
                try {
                    const res = await getAuditAction(charityId, 1);
                    if (res.ok && res.payload?.data?.data?.answers) {
                        setAuditVals(res.payload.data.data.answers);
                    } else {
                        console.error('Failed to fetch audit data from API');
                    }
                } catch (error) {
                    console.error('Error fetching audit data:', error);
                }
            } else {
                // Fetch from localStorage for editing mode
                const stored = localStorage.getItem(`audit-form-data-${charityId}-core-area-1`);
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
                coreArea: 1,
                answers: auditVals
            };

            const res = await submitAuditAction(payload);

            if (res.ok) {
                // After submission, mark as complete
                const completePayload = {
                    charityId,
                    coreArea: 1
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

    const getValue = (code: string) => auditVals[code];
    const isUk = country === 'united-kingdom' || country === 'uk';
    const isUs = country === 'united-states' || country === 'usa' || country === 'us';

    const getFieldCode = (field: 'giftAid' | 'link' | 'notes') => {
        if (isUk) {
            return {
                giftAid: 'CS04',
                link: 'CS05',
                notes: 'CS08'
            }[field];
        } else {
            // US and Canada
            return {
                giftAid: 'CS04',
                link: 'CS06',
                notes: 'CS07'
            }[field];
        }
    };

    const getLabel = (field: 'giftAid' | 'link' | 'notes') => {
        if (isUk) {
            return {
                giftAid: 'Gift Aid Eligibility',
                link: 'Link to Gift Aid Status',
                notes: 'Status Notes'
            }[field];
        } else {
            return {
                giftAid: 'Tax-Deductible',
                link: 'Evidence Link',
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
                <span className='flex gap-2 items-center'>
                    <span>{capitalizeWords(getValue('CS03') || '-')}</span>

                    {/* Registration Date & Evidence Link (if 'Pending Registration') */}
                    {getValue('CS03') === 'Pending Registration' && (
                        <div className="flex flex-col gap-1 text-xs text-muted-foreground ml-4 border-l pl-4">
                            {getValue('CS09') && <div>Date: {new Date(getValue('CS09')).toLocaleDateString()}</div>}
                            {getValue('CS11') && <div>Link: <LinkComponent openInNewTab to={getValue('CS11')} className="underline">{getValue('CS11')}</LinkComponent></div>}
                        </div>
                    )}
                </span>
            } />

            <PreviewValueLayout label={getLabel('giftAid')!} result={`${getValue(getFieldCode('giftAid')!) || '-'}`} />

            <PreviewValueLayout label={getLabel('link')!} result={
                getValue(getFieldCode('link')!) ? <LinkComponent openInNewTab className='hover:underline text-primary' to={getValue(getFieldCode('link')!)}>{getValue(getFieldCode('link')!)}</LinkComponent> : '-'
            } />

            <PreviewValueLayout orientation='vertical' label={getLabel('notes')!} result={getValue(getFieldCode('notes')!) || '-'} />

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
                        // Go back to edit mode
                        // Remove preview-mode=true param
                        router.push(`/charities/${charityId}/audits/core-area-1?country=${country}`)
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

export default PreviewCoreArea1
