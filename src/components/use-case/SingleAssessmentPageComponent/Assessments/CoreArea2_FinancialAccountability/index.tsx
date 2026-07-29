import React, { FC, useMemo, useState } from 'react'
import SingleSectionQuestion from '../../SingleSectionQuestion'
import AssessmentSectionCard from '../../UI/AuditSectionCard'
import RadioGroupComponent from '@/components/common/RadioGroupComponent'
import DatePicker from '@/components/common/ControlledDatePickerComponent'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import { CORE_AREA_2_FORMS, getQuestionFieldKey, labelToSnakeCase } from '@/lib/assessment-forms/core-area-2'
import { Question } from '@/lib/assessment-forms/types'
import { formatDateToYYYYMMDD } from '@/lib/helpers'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import {
    getAssessmentTargetElementId,
    useAssessmentContentReveal,
    useAssessmentNavigationDismiss,
    useAssessmentScrollDismiss,
} from '@/hooks/use-assessment-navigation'
import { useRouteLoader } from '@/components/common/route-loader-provider'
import AssessmentResetButton from '../../UI/AssessmentResetButton'

type IProps = {
    location: 'united-kingdom' | 'united-states' | 'canada' | 'uk' | 'usa' | 'us' | 'ca';
    charityId: string;
    currentUserRoles?: string[];
    status?: string;
}

const CoreArea2: FC<IProps> = ({ location = 'united-states', charityId, currentUserRoles = [], status }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isNavigating } = useRouteLoader();
    const questionFromUrl = searchParams.get('question');
    const appliedDeepLinkRef = React.useRef(false);
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [isEditable, setIsEditable] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isPreviewing, setIsPreviewing] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const [scrollTargetId, setScrollTargetId] = useState<string | null>(null);

    const isFinanceAssessor = currentUserRoles.some(r => 
        ['finance-assessor', 'financial-assessor', 'financial-auditor', 'finance-auditor'].includes(r.toLowerCase())
    );
    const isManager = currentUserRoles.some(r => ['operation-manager', 'operations-manager', 'project-manager'].includes(r.toLowerCase()));

    const formDefinition = useMemo(() => {
        const normalized = location === 'uk' ? 'united-kingdom'
            : location === 'usa' || location === 'us' ? 'united-states'
                : location === 'ca' ? 'canada'
                    : location;

        return CORE_AREA_2_FORMS.find(f => f.countryCode === normalized)
            || CORE_AREA_2_FORMS.find(f => f.countryCode === 'united-states')
    }, [location])
    
    const canEdit = isEditable || isFinanceAssessor || isManager;
    const isReady = Boolean(formDefinition) && !isLoading;
    const contentVisible = useAssessmentContentReveal(isLoading, isReady);

    useAssessmentScrollDismiss({
        scrollTargetId,
        setScrollTargetId,
        elementIdPrefix: 'question',
    });

    useAssessmentNavigationDismiss({
        isNavigating,
        isLoading,
        isReady,
        targetFromUrl: questionFromUrl,
        deepLinkAppliedRef: appliedDeepLinkRef,
        scrollTargetId,
    });

    const updateFormData = (field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    // Prefill logic
    React.useEffect(() => {
        const fetchAssessment = async () => {
            if (!charityId || !formDefinition) return;
            try {
                const { getAssessmentAction } = await import('@/app/actions/assessments');
                const res = await getAssessmentAction(charityId, 2);

                if (res.ok && res.payload?.data?.data) {
                    const answers = res.payload.data.data.answers || {};
                    setIsEditable(res.payload.data.data.isEditable !== false);
                    const newFormData: Record<string, any> = {};

                    formDefinition.questions.forEach(q => {
                        const primaryKey = getQuestionFieldKey(q);
                        const legacyKey = labelToSnakeCase(q.label);
                        const ans = answers[primaryKey] ?? answers[legacyKey]
                            ?? (q.code === 'F01' ? answers.assessmented_financial_statements_available_on_website : undefined)
                            ?? (q.code === 'F02' ? answers.previous_year_assessmented_financial_statements_available_on_website : undefined);
                        if (ans !== undefined && ans !== null) {
                            if (q.type === 'date' && typeof ans === 'string') {
                                const dateObj = new Date(ans);
                                if (!isNaN(dateObj.getTime())) {
                                    newFormData[q.code] = dateObj;
                                }
                            } else {
                                newFormData[q.code] = ans;
                            }
                        }
                    });

                    if (Object.keys(newFormData).length > 0) {
                        setFormData(prev => ({ ...prev, ...newFormData }));
                    }
                }
            } catch (error) {
                console.error("Failed to fetch assessment draft", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAssessment();
    }, [charityId, formDefinition]);

    React.useEffect(() => {
        if (appliedDeepLinkRef.current || isLoading || !questionFromUrl || !formDefinition) return;

        const question = formDefinition.questions.find(q => q.code === questionFromUrl);
        if (!question) return;

        appliedDeepLinkRef.current = true;
        setScrollTargetId(question.code);
    }, [formDefinition, questionFromUrl, isLoading]);

    if (!formDefinition) return <div>Form not found for location: {location}</div>

    const wrapQuestion = (question: Question, content: React.ReactNode) => (
        <div
            key={question.id}
            id={getAssessmentTargetElementId('question', question.code)}
            className="scroll-mt-4"
        >
            {content}
        </div>
    );

    const renderQuestion = (question: Question) => {
        // Basic dependency check based on simplistic scoreLogic parsing or custom logic if needed.
        // The provided JSON has scoreLogic strings like "if answers['CS03'] == 'Registered' ...".
        // Evaluating this string dynamically is complex. purely for visibility, we might check simple dependencies if strictly required.
        // For Core Area 2, most fields seem independent except maybe hidden ones.
        // Looking at the JSON, questions like "Status Evidence Type" seem to depend conceptually, but scoreLogic is null for them in JSON provided for Core Area 2?
        // Wait, looking at Core Area 2 JSON: 
        // Most fields are simple.
        // Let's implement basic rendering first.

        const fieldCode = question.code;

        switch (question.type) {
            case 'text':
            case 'number':
                return wrapQuestion(question,
                    <SingleSectionQuestion
                        type="text"
                        heading={question.label}
                        id={`core_2__${fieldCode}`}
                        required={question.required}
                        onInputChange={(_name, value) => updateFormData(fieldCode, value)}
                        inputProps={{
                            type: question.type === 'number' ? 'number' : 'text',
                            value: formData[fieldCode] ?? '',
                            ...(fieldCode === 'F17' ? { min: 0, max: 100, step: 'any' } : {}),
                            ...(fieldCode === 'F18' ? { min: 0, step: 'any' } : {}),
                            ...(fieldCode === 'F16' ? { min: 0, step: 'any' } : {}),
                            ...(fieldCode === 'F04' || fieldCode === 'F05' || fieldCode === 'F06' ? { min: 0, max: 100, step: 'any' } : {}),
                        }}
                    />
                )
            case 'radio':
                return wrapQuestion(question,
                    <AssessmentSectionCard>
                        <RadioGroupComponent
                            value={formData[fieldCode] || ''}
                            onChange={(newVal) => updateFormData(fieldCode, newVal)}
                            label={question.label}
                            labelClassNames='text-sm'
                            name={`core_2__${fieldCode}`}
                            required={question.required}
                            options={question.options.map(opt => ({
                                label: opt.label,
                                value: opt.label
                            }))}
                        />
                    </AssessmentSectionCard>
                )
            case 'date':
                return wrapQuestion(question,
                    <AssessmentSectionCard>
                        <div className="flex flex-col gap-2">
                            <span className='font-semibold text-sm'>
                                {question.label}{question.required ? <span className="text-red-500">*</span> : ''}
                            </span>
                            <div className="w-full sm:w-[306px]">
                                <DatePicker
                                    label={question.label}
                                    onChange={(date) => updateFormData(fieldCode, date ?? null)}
                                    value={formData[fieldCode] || undefined}
                                />
                            </div>
                        </div>
                    </AssessmentSectionCard>
                )
            case 'paragraph':
            case 'textarea' as any:
                return wrapQuestion(question,
                    <SingleSectionQuestion
                        type="textarea"
                        heading={question.label}
                        lines={6}
                        id={`core_2__${fieldCode}`}
                        required={question.required}
                        value={formData[fieldCode] || ''}
                        onInputChange={(_name, value) => updateFormData(fieldCode, value)}
                    />
                )
            default:
                return null
        }
    }

    const validateRequiredAnswers = () => {
        if (!formDefinition) return false;

        const missing = formDefinition.questions.filter((q) => {
            if (!q.required) return false;
            const val = formData[q.code];
            if (val === undefined || val === null || val === '') return true;
            if (q.type === 'number' && Number.isNaN(Number(val))) return true;
            return false;
        });

        if (missing.length > 0) {
            toast.error(`Please complete required fields: ${missing.map((q) => q.label).slice(0, 4).join(', ')}${missing.length > 4 ? '…' : ''}`);
            const first = missing[0];
            document.getElementById(getAssessmentTargetElementId('question', first.code))
                ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return false;
        }

        return true;
    };

    const handleSaveDraft = async () => {
        const answers: Record<string, any> = {};
        if (!formDefinition) return;

        formDefinition.questions.forEach(q => {
            const key = getQuestionFieldKey(q);
            const val = formData[q.code];
            if (val !== undefined && val !== null && val !== "") {
                if (q.type === 'number') {
                    const num = Number(val);
                    if (!isNaN(num)) {
                        answers[key] = num;
                    }
                } else if (q.type === 'date' && val instanceof Date) {
                    answers[key] = formatDateToYYYYMMDD(val);
                } else {
                    answers[key] = val;
                }
            }
        });

        if (Object.keys(answers).length > 0) {
            try {
                const { submitAssessmentAction, editAssessmentAction } = await import('@/app/actions/assessments');
                
                const isEdit = status === 'submitted' || status === 'completed';

                if (isEdit) {
                    await editAssessmentAction({
                        charityId,
                        coreArea: 2,
                        answers
                    });
                } else {
                    await submitAssessmentAction({
                        charityId,
                        coreArea: 2,
                        answers
                    });
                }
            } catch (e) {
                console.error("Failed to save draft", e);
            }
        }
    }

    const handleResetAssessment = () => {
        setFormData({})
        if (typeof window !== 'undefined') {
            localStorage.removeItem(`assessment-form-data-${charityId}-core-area-2`)
        }
    }

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading assessment...</div>;
    }

    return (
        <>
            <div
                className={cn(
                    'flex flex-col gap-6 transition-opacity duration-500 ease-out',
                    contentVisible ? 'opacity-100' : 'opacity-0',
                )}
            >
                {canEdit === false && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md mb-4 text-sm font-medium">
                        View Only Mode: You are not authorized to edit this core area.
                    </div>
                )}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-xl font-bold text-gray-900">Financial Accountability</h2>
                    {canEdit ? (
                        <AssessmentResetButton
                            onReset={handleResetAssessment}
                            disabled={isPreviewing || isCancelling}
                        />
                    ) : null}
                </div>
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
                    <p className="font-semibold">Airtable / scoring inputs</p>
                    <ul className="mt-1 list-disc space-y-1 pl-5 text-amber-800">
                        <li>Complete all required finance fields so backend can fill Airtable columns on CA2 completion.</li>
                        <li>Fundraising % + Administrative % should stay under 30% combined (mandatory gate).</li>
                        <li>Reserves of 36 months or more will fail the mandatory reserves gate.</li>
                        <li>Current-year audited financials must be available on the website.</li>
                    </ul>
                </div>
                {formDefinition.questions.map(q => renderQuestion(q))}
            </div>

            {/* Action Buttons */}
            {!canEdit ? null : (
                <div className='flex flex-col gap-3 mb-8 mt-8 sm:flex-row sm:items-center sm:gap-4'>
                    <Button
                        className="w-full sm:w-36"
                        variant='primary'
                        loading={isPreviewing}
                        disabled={isPreviewing || isCancelling}
                        onClick={async () => {
                            if (isPreviewing || isCancelling) return;
                            if (!validateRequiredAnswers()) return;

                            setIsPreviewing(true);
                            try {
                                if (typeof window !== 'undefined') {
                                    localStorage.setItem(`assessment-form-data-${charityId}-core-area-2`, JSON.stringify(formData));
                                }

                                await handleSaveDraft();

                                router.push(`/charities/${charityId}/assessments/core-area-2?preview-mode=true&country=${location}`)
                            } catch (e) {
                                console.error('Failed to open preview', e);
                                setIsPreviewing(false);
                            }
                        }}
                    >
                        {isPreviewing ? 'Saving...' : 'Preview'}
                    </Button>
                    <Button
                        className="w-full sm:w-36"
                        variant={'outline'}
                        disabled={isPreviewing || isCancelling}
                        loading={isCancelling}
                        onClick={() => {
                            if (isPreviewing || isCancelling) return;
                            setIsCancelling(true);
                            router.push(`/charities/${charityId}`);
                        }}
                    >
                        {isCancelling ? 'Leaving...' : 'Cancel'}
                    </Button>
                </div>
            )}
        </>
    )
}

export default CoreArea2
