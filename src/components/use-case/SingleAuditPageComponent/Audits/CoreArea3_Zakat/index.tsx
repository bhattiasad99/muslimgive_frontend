'use client'
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import React, { FC, useState } from 'react'
import { MULTI_STEP_DEFS, QuestionDef } from './MULTI_STEP_DEFS';

import ComplexCheckboxGroup, { ComplexCheckboxGroupStatus } from './ComplexCheckboxGroup';
import AuditSectionCard from '../../UI/AuditSectionCard';
import { useRouter } from 'next/navigation';

type Steps = 0 | 1 | 2 | 3 | 4;

export type SingleFormPageCommonProps = {
    questions: QuestionDef[]
}

type FormEntry = ComplexCheckboxGroupStatus & {
    id: string;
}

// Explicit mapping from ID to API Key based on user request
const ID_TO_API_KEY: Record<string, string> = {
    'clear-public-zakat-policy-available': 'clear_public_zakat_policy_available',
    'turnaround-time-for-zakat-distribution-disclosed': 'turnaround_time_for_zakat_distribution_disclosed',
    'explanation-and-actions-outlined-for-zakat-undistributed-beyond-one-lunar-year': 'explanation_and_actions_outlined_for_zakat_undistributed_beyond_one_lunar_year',
    'disclosure-of-zakat-management-administration-fees': 'disclosure_of_zakat_management_or_administration_fees',
    'clear-separation-of-zakat-funds-from-general-donations': 'clear_separation_of_zakat_funds_from_general_donations',
    'vetting-process-for-zakat-funds-application': 'vetting_process_for_zakat_funds_application',
    'zakat-policy-clearly-labeled-and-accessible': 'zakat_policy_clearly_labeled_and_accessible',
    'shariah-advisory-board-established': 'shariah_advisory_board_established_to_advise_set_policies_review_and_audit',
    'names-of-shariah-advisory-board-listed': 'names_of_shariah_advisory_board_listed',
    'individuals-serving-on-the-governing-board': 'individuals_serving_on_the_governing_board',
    'explanation-of-compliance-with-regulations': 'explanation_of_compliance_with_regulations_set_out_by_the_relevant_governmental_authority_e_g_cra_irs_charity_commission',
    'explanation-why-zakat-funds-are-collected-and-distributed': 'explanation_why_zakat_funds_are_collected_and_distributed',
    'clear-explanation-of-zakat-fund-flow': 'clear_explanation_of_zakat_fund_flow_and_transfer_of_ownership_tamlik',
    'clear-mention-of-zakat-used-for-adults-and-minors': 'clear_mention_of_zakat_being_used_to_support_both_adults_and_minors_with_explanation',
    'purpose-of-zakat-collection': 'purpose_of_zakat_collection_mention_of_whether_zakat_is_distributed_in_cash_or_other_forms',
    'audit-procedures': 'audit_procedures_internal_or_external',
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

const CoreArea3: FC<{ charityId: string }> = ({ charityId }) => {
    const router = useRouter();
    const [step, setStep] = useState<Steps>(0);
    const [formEntries, setFormEntries] = useState<FormEntry[]>([]);
    const scrollToTop = () => {
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    const handleNext = () => {
        if (step < 4) {
            setStep((prev) => (prev + 1) as Steps);
        }
        scrollToTop();
    }
    const handlePrev = () => {
        if (step > 0) {
            setStep((prev) => (prev - 1) as Steps);
        }
        scrollToTop();
    }


    // Prefill logic
    React.useEffect(() => {
        const fetchAudit = async () => {
            if (!charityId) return;
            try {
                const { getAuditAction } = await import('@/app/actions/audits');
                const res = await getAuditAction(charityId, 3);
                console.log("CoreArea3 Prefill result:", res);

                if (res.ok && res.payload?.data?.data?.answers) {
                    const answers = res.payload.data.data.answers;
                    const loadedEntries: FormEntry[] = [];

                    // Flatten DEFS to iterate all possible questions
                    const allQuestions = Object.values(MULTI_STEP_DEFS).flat();

                    allQuestions.forEach(q => {
                        // Use mapped key or fallback to snake_case of ID
                        const key = ID_TO_API_KEY[q.id] || q.id.replace(/-/g, '_');
                        const ans = answers[key];
                        // console.log(`Mapping ${q.id} -> ${key}, Found:`, !!ans);

                        // Check if answer exists and has minimal expected structure
                        if (ans && (ans.selections?.length > 0 || ans.links?.length > 0 || ans.note)) {
                            loadedEntries.push({
                                id: q.id,
                                selectedOptions: ans.selections || [],
                                linksAdded: ans.links?.map((url: string) => ({ label: '', url })) || [],
                                commentsAdded: ans.note || ''
                            });
                        }
                    });

                    if (loadedEntries.length > 0) {
                        setFormEntries(loadedEntries);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch audit draft", error);
            }
        };

        fetchAudit();
    }, [charityId]);

    const handleSaveDraft = async () => {
        const answers: Record<string, any> = {};

        formEntries.forEach(entry => {
            // Use mapped key or fallback
            const key = ID_TO_API_KEY[entry.id] || entry.id.replace(/-/g, '_');
            answers[key] = {
                selections: entry.selectedOptions || [],
                links: entry.linksAdded?.map(l => l.url) || [],
                note: entry.commentsAdded || ""
            };
        });

        // Only save if we have data
        if (Object.keys(answers).length > 0) {
            try {
                const { submitAuditAction } = await import('@/app/actions/audits');
                console.log("Submitting CA3 Draft Payload:", JSON.stringify(answers, null, 2));
                await submitAuditAction({
                    charityId,
                    coreArea: 3,
                    answers
                });
            } catch (e) {
                console.error("Failed to save draft", e);
            }
        }
    }

    return (
        <>
            <div className="flex flex-col gap-2 max-w-[350px]">
                <Progress value={(step + 1) * 20} />
                Page {step + 1} of 5
            </div>
            <div>
                {MULTI_STEP_DEFS[step].map(eachQuestion => {
                    return <AuditSectionCard key={eachQuestion.id}>
                        <ComplexCheckboxGroup defaultStatus={formEntries.find(eachEntry => eachEntry.id === eachQuestion.id)} id={eachQuestion.id} label={eachQuestion.label} required options={eachQuestion.options}
                            onUpdate={(update) => {
                                const temp = [...formEntries];
                                const existingIndex = temp.findIndex(item => item.id === eachQuestion.id);
                                if (existingIndex > -1) {
                                    temp[existingIndex] = { id: eachQuestion.id, ...update };
                                } else {
                                    temp.push({ id: eachQuestion.id, ...update });
                                }
                                setFormEntries(temp);
                            }}
                        />
                    </AuditSectionCard>
                })}
            </div>
            <div className='flex flex-col gap-3 mb-8 sm:flex-row sm:items-center sm:gap-4'>
                <Button className="w-full sm:w-36" variant='primary' onClick={async () => {
                    if (step < 4) {
                        handleNext()
                    }
                    else {
                        if (typeof window !== 'undefined') {
                            localStorage.setItem(`audit-form-data-${charityId}-core-area-3`, JSON.stringify(formEntries));
                        }

                        await handleSaveDraft();

                        router.push(`/charities/${charityId}/audits/core-area-3?preview-mode=true`)
                    }
                }}>{step === 4 ? 'Preview' : 'Next'}</Button>
                <Button className="w-full sm:w-36" variant={'outline'} onClick={() => {
                    if (step > 0) {
                        handlePrev()
                    }
                }}>{step === 0 ? 'Cancel' : 'Back'}</Button>
            </div>
        </>
    )
}

export default CoreArea3
