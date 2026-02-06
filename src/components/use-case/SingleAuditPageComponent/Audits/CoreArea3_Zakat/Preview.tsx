'use client'
import { CountryCode } from '@/app/(dashboard)/charities/[id]/audits/[audit]/page';
import { AuditStatus } from '@/DUMMY_AUDIT_VALS';
import React, { FC, useEffect, useState } from 'react'
import PreviewValueLayout from '../../UI/PreviewValueLayout';
import LinkComponent from '@/components/common/LinkComponent';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import ModelComponentWithExternalControl from '@/components/common/ModelComponent/ModelComponentWithExternalControl';
import SubmittedSymbol from '../../Audits/CoreArea1_CharityStatus/SubmittedSymbol';
import { submitAuditAction, completeAuditAction, getAuditAction } from '@/app/actions/audits';
import { toast } from 'sonner';
import { MULTI_STEP_DEFS } from './MULTI_STEP_DEFS';

export type PreviewPageCommonProps = {
    country: CountryCode;
    status: AuditStatus;
    charityId: string;
    fetchFromAPI?: boolean;
}

type IProps = PreviewPageCommonProps;

// Flatten the MULTI_STEP_DEFS to easily find labels by ID
const ALL_QUESTIONS = Object.values(MULTI_STEP_DEFS).flat();

type LinkAttached = {
    label: string;
    url: string;
}

// Actual shape saved in localStorage is:
type StoredFormEntry = {
    id: string;
    selectedOptions: string[];
    linksAdded: LinkAttached[];
    commentsAdded: string;
}

const PreviewCoreArea3: FC<IProps> = ({ country, charityId, fetchFromAPI = false }) => {
    void country;
    const [auditVals, setAuditVals] = useState<StoredFormEntry[] | null>(null);
    const [showSubmittedModel, setShowSubmittedModel] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            if (fetchFromAPI) {
                try {
                    const res = await getAuditAction(charityId, 3);
                    if (res.ok && res.payload?.data?.data?.answers) {
                        const answers = res.payload.data.data.answers;
                        // Transform object to array format expected by the component
                        // API returns: { "key": { selections, links, note }, ... }
                        // Component expects: [{ id: "key", selectedOptions, linksAdded, commentsAdded }, ...]
                        if (typeof answers === 'object' && !Array.isArray(answers)) {
                            const transformedArray: StoredFormEntry[] = Object.entries(answers).map(([key, value]: [string, any]) => ({
                                id: key,
                                selectedOptions: value.selections || [],
                                linksAdded: (value.links || []).map((link: string) => ({ label: link, url: link })),
                                commentsAdded: value.note || ''
                            }));
                            setAuditVals(transformedArray);
                        } else if (Array.isArray(answers)) {
                            setAuditVals(answers);
                        } else {
                            console.error('API returned answers in unexpected format');
                            setAuditVals([]);
                        }
                    } else {
                        console.error('Failed to fetch audit data from API');
                        setAuditVals([]);
                    }
                } catch (error) {
                    console.error('Error fetching audit data:', error);
                    setAuditVals([]);
                }
            } else {
                const stored = localStorage.getItem(`audit-form-data-${charityId}-core-area-3`);
                if (stored) {
                    try {
                        setAuditVals(JSON.parse(stored));
                    } catch (e) {
                        console.error("Failed to parse stored audit data", e);
                        setAuditVals([]);
                    }
                } else {
                    setAuditVals([]);
                }
            }
        };

        fetchData();
    }, [charityId, fetchFromAPI]);

    const handleSubmit = async () => {
        if (!auditVals) return;
        setIsSubmitting(true);
        try {
            const answers: Record<string, any> = {};

            auditVals.forEach(entry => {
                const key = entry.id.replace(/-/g, '_');
                answers[key] = {
                    selections: entry.selectedOptions || [],
                    links: entry.linksAdded?.map(l => l.url) || [],
                    note: entry.commentsAdded || ""
                };
            });

            const payload = {
                charityId,
                coreArea: 3,
                answers: answers
            };

            const res = await submitAuditAction(payload);

            if (res.ok) {
                const completePayload = {
                    charityId,
                    coreArea: 3
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

    if (!Array.isArray(auditVals)) {
        return <div>Invalid audit data format</div>
    }

    if (auditVals.length === 0) {
        return <div>No audit data available</div>
    }

    return (
        <div className='flex flex-col gap-4'>
            {auditVals.map(entry => {
                const questionDef = ALL_QUESTIONS.find(q => q.id === entry.id);
                const label = questionDef ? questionDef.label : entry.id;

                // Map selection values to labels if possible
                const selectionLabels = entry.selectedOptions?.map(val => {
                    const option = questionDef?.options.find(opt => opt.value === val);
                    return option ? option.label : val;
                }) || [];

                return (
                    <div key={entry.id} className="border p-4 rounded-md">
                        <PreviewValueLayout label={label} result={
                            <div className="flex flex-col gap-2">
                                {selectionLabels.length > 0 && (
                                    <div>
                                        <span className="font-semibold text-xs text-muted-foreground uppercase mb-1 block">Selections:</span>
                                        <ul className="list-disc pl-5">
                                            {selectionLabels.map((sel, idx) => (
                                                <li key={idx}>{sel}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {entry.linksAdded && entry.linksAdded.length > 0 && (
                                    <div>
                                        <span className="font-semibold text-xs text-muted-foreground uppercase mb-1 block">Links:</span>
                                        <ul className="list-disc pl-5">
                                            {entry.linksAdded.map((link, idx) => (
                                                <li key={idx}>
                                                    <LinkComponent openInNewTab className='hover:underline text-primary' to={link.url}>{link.url}</LinkComponent>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {entry.commentsAdded && (
                                    <div>
                                        <span className="font-semibold text-xs text-muted-foreground uppercase mb-1 block">Note:</span>
                                        <p className="whitespace-pre-wrap">{entry.commentsAdded}</p>
                                    </div>
                                )}
                            </div>
                        } />
                    </div>
                );
            })}

            <div className='flex flex-col gap-3 mb-8 sm:flex-row sm:items-center sm:gap-4 mt-4'>
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
                        router.push(`/charities/${charityId}/audits/core-area-3`)
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

export default PreviewCoreArea3
