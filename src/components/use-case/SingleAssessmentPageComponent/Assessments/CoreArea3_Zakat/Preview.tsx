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
import { submitAssessmentAction, completeAssessmentAction, getAssessmentAction, editAssessmentAction } from '@/app/actions/assessments';
import { toast } from 'sonner';
import { MULTI_STEP_DEFS } from './MULTI_STEP_DEFS';

export type PreviewPageCommonProps = {
    country: CountryCode;
    status: AssessmentStatus;
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

const PreviewCoreArea3: FC<IProps> = ({ country, status, charityId, fetchFromAPI = false }) => {
    const isEditMode = status === 'submitted' || status === 'completed';
    void country;
    const [assessmentVals, setAssessmentVals] = useState<StoredFormEntry[] | null>(null);
    const [showSubmittedModel, setShowSubmittedModel] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            if (fetchFromAPI) {
                try {
                    const res = await getAssessmentAction(charityId, 3);
                    if (res.ok && res.payload?.data?.data?.answers) {
                        const answers = res.payload.data.data.answers;
                        // Transform object to array format expected by the component
                        // API returns: { "key": { selections, links, note }, ... }
                        // Component expects: [{ id: "key", selectedOptions, linksAdded, commentsAdded }, ...]
                        if (typeof answers === 'object' && !Array.isArray(answers)) {
                            const transformedArray: StoredFormEntry[] = Object.entries(answers).map(([key, value]: [string, any]) => ({
                                id: key.replace(/_/g, '-'), // Map snake_case back to hyphenated IDs
                                selectedOptions: value.selections || [],
                                linksAdded: (value.links || []).map((link: string) => ({ label: link, url: link })),
                                commentsAdded: value.note || ''
                            }));
                            setAssessmentVals(transformedArray);
                        } else if (Array.isArray(answers)) {
                            setAssessmentVals(answers);
                        } else {
                            console.error('API returned answers in unexpected format');
                            setAssessmentVals([]);
                        }
                    } else {
                        console.error('Failed to fetch assessment data from API');
                        setAssessmentVals([]);
                    }
                } catch (error) {
                    console.error('Error fetching assessment data:', error);
                    setAssessmentVals([]);
                }
            } else {
                const stored = localStorage.getItem(`assessment-form-data-${charityId}-core-area-3`);
                if (stored) {
                    try {
                        setAssessmentVals(JSON.parse(stored));
                    } catch (e) {
                        console.error("Failed to parse stored assessment data", e);
                        setAssessmentVals([]);
                    }
                } else {
                    setAssessmentVals([]);
                }
            }
        };

        fetchData();
    }, [charityId, fetchFromAPI]);

    const handleSubmit = async () => {
        if (!assessmentVals) return;
        setIsSubmitting(true);
        console.log('[PreviewCoreArea3] handleSubmit triggered. isEditMode:', isEditMode);
        try {
            const ID_TO_API_KEY: Record<string, string> = {
                'clear-public-zakat-policy-available': 'clear_public_zakat_policy_available',
                'turnaround-time-for-zakat-distribution-disclosed': 'turnaround_time_for_zakat_distribution_disclosed',
                'explanation-and-actions-outlined-for-zakat-undistributed-beyond-one-lunar-year': 'explanation_and_actions_outlined_for_zakat_undistributed_beyond_one_lunar_year',
                'disclosure-of-zakat-management-administration-fees': 'disclosure_of_zakat_management_or_administration_fees',
                'clear-separation-of-zakat-funds-from-general-donations': 'clear_separation_of_zakat_funds_from_general_donations',
                'vetting-process-for-zakat-funds-application': 'vetting_process_for_zakat_funds_application',
                'zakat-policy-clearly-labeled-and-accessible': 'zakat_policy_clearly_labeled_and_accessible',
                'shariah-advisory-board-established': 'shariah_advisory_board_established_to_advise_set_policies_review_and_assessment',
                'names-of-shariah-advisory-board-listed': 'names_of_shariah_advisory_board_listed',
                'individuals-serving-on-the-governing-board': 'individuals_serving_on_the_governing_board',
                'explanation-of-compliance-with-regulations': 'explanation_of_compliance_with_regulations_set_out_by_the_relevant_governmental_authority_e_g_cra_irs_charity_commission',
                'explanation-why-zakat-funds-are-collected-and-distributed': 'explanation_why_zakat_funds_are_collected_and_distributed',
                'clear-explanation-of-zakat-fund-flow': 'clear_explanation_of_zakat_fund_flow_and_transfer_of_ownership_tamlik',
                'clear-mention-of-zakat-used-for-adults-and-minors': 'clear_mention_of_zakat_being_used_to_support_both_adults_and_minors_with_explanation',
                'purpose-of-zakat-collection': 'purpose_of_zakat_collection_mention_of_whether_zakat_is_distributed_in_cash_or_other_forms',
                'assessment-procedures': 'assessment_procedures_internal_or_external',
                'mention-of-zakat-eligibility-criteria': 'mention_of_zakat_eligibility_criteria',
                'disclosure-of-public-fundraising-costs': 'disclosure_of_public_fundraising_costs',
                'zakat-calculator-on-website': 'zakat_calculator_on_the_website',
                'zakat-education-bank': 'zakat_education_bank',
                'live-zakat-calculation-support': 'live_zakat_calculation_support',
                'formal-approval-on-zakat-campaigns': 'formal_approval_on_zakat_campaigns',
                'details-on-the-fuqara-category': 'details_on_the_fuqara_category_and_its_recipients',
                'details-on-the-masakin-category': 'details_on_the_masakin_category_and_its_recipients',
                'details-on-the-amilin-alayha-category': 'details_on_the_amilin_alayha_category_in_zakat_distribution',
                'details-on-the-al-muallafat-qulubuhum-category': 'details_on_the_al_muallafat_qulubuhum_category_and_its_recipients',
                'details-on-the-fi-ar-riqab-category': 'details_on_the_fi_ar_riqab_category_and_its_recipients',
                'details-on-the-al-gharimin-category': 'details_on_the_al_gharimin_category_and_its_recipients',
                'details-on-the-fi-sabilillah-category': 'details_on_the_fi_sabilillahi_category_and_its_recipients',
                'details-on-the-ibn-as-sabil-category': 'details_on_the_ibn_as_sabil_category_and_its_recipients',
            };

            const mappedAnswers: Record<string, any> = {};
            assessmentVals.forEach(entry => {
                const key = ID_TO_API_KEY[entry.id] || entry.id.replace(/-/g, '_');
                mappedAnswers[key] = {
                    selections: entry.selectedOptions || [],
                    links: entry.linksAdded?.map(l => l.url) || [],
                    note: entry.commentsAdded || ""
                };
            });

            const payload = {
                charityId,
                coreArea: 3,
                answers: mappedAnswers
            };
            console.log('[PreviewCoreArea3] Sending Payload:', JSON.stringify(payload, null, 2));

            const res = isEditMode
                ? await editAssessmentAction(payload)
                : await submitAssessmentAction(payload);
            
            console.log('[PreviewCoreArea3] API Response:', JSON.stringify(res, null, 2));

            if (res.ok) {
                if (!isEditMode) {
                    const completePayload = {
                        charityId,
                        coreArea: 3
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

    if (!Array.isArray(assessmentVals)) {
        return <div>Invalid assessment data format</div>
    }

    if (assessmentVals.length === 0) {
        return <div>No assessment data available</div>
    }

    return (
        <div className='flex flex-col gap-4'>
            {assessmentVals.map(entry => {
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
                            router.push(`/charities/${charityId}/assessments/core-area-3`)
                        } else {
                            router.push(`/charities/${charityId}/assessments/core-area-3?preview-mode=false`)
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

export default PreviewCoreArea3
