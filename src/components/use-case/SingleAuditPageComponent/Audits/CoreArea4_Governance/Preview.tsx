'use client'
import { CountryCode } from '@/app/(dashboard)/charities/[id]/audits/[audit]/page';
import { AuditStatus } from '@/DUMMY_AUDIT_VALS';
import React, { FC, useEffect, useState, useMemo } from 'react'
import PreviewValueLayout from '../../UI/PreviewValueLayout';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';
import ModelComponentWithExternalControl from '@/components/common/ModelComponent/ModelComponentWithExternalControl';
import SubmittedSymbol from '../../Audits/CoreArea1_CharityStatus/SubmittedSymbol';
import { submitAuditAction, completeAuditAction } from '@/app/actions/audits';
import { toast } from 'sonner';
import { CORE_AREA_4_FORMS } from '@/lib/audit-forms/core-area-4';

export type PreviewPageCommonProps = {
    country: CountryCode;
    status: AuditStatus
}

type IProps = PreviewPageCommonProps;

const PreviewCoreArea4: FC<IProps> = ({ country }) => {
    const [auditVals, setAuditVals] = useState<Record<string, string> | null>(null);
    const [showSubmittedModel, setShowSubmittedModel] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const charityId = pathname.split('/')[2];

    const currentForm = useMemo(() => {
        const countryMap: Record<string, 'uk' | 'usa' | 'canada'> = {
            'uk': 'uk',
            'usa': 'usa',
            'ca': 'canada'
        };
        // Safely handle if country is undefined or not in map, default to uk
        const mappedCountry = (country && countryMap[country]) ? countryMap[country] : 'uk';
        return CORE_AREA_4_FORMS.find(f => f.countryCode === mappedCountry) || CORE_AREA_4_FORMS[0];
    }, [country]);

    useEffect(() => {
        const stored = localStorage.getItem(`audit-form-data-${charityId}-core-area-4`);
        if (stored) {
            try {
                setAuditVals(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse stored audit data", e);
            }
        }
    }, [charityId]);

    const handleSubmit = async () => {
        if (!auditVals) return;
        setIsSubmitting(true);
        try {
            const payload = {
                charityId,
                coreArea: 4,
                answers: auditVals
            };

            const res = await submitAuditAction(payload);

            if (res.ok) {
                const completePayload = {
                    charityId,
                    coreArea: 4
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

    return (
        <div className='flex flex-col gap-4'>
            {currentForm.questions.map(question => {
                const answer = auditVals[question.code];
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
                    Submit Audit
                </Button>
                <Button
                    className="w-full sm:w-36"
                    variant={'outline'}
                    onClick={() => {
                        router.push(`/charities/${charityId}/audits/core-area-4?country=${country}`)
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

export default PreviewCoreArea4