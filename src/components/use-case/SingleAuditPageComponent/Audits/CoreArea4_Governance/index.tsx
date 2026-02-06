import React, { FC } from 'react'
import SingleRadioQuestion from './SingleRadioQuestion'
import { CORE_AREA_4_FORMS } from '@/lib/audit-forms/core-area-4';
import { Question } from '@/lib/audit-forms/types';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation'
import { TypographyComponent } from '@/components/common/TypographyComponent';

type CoreArea4Props = {
    charityId: string;
    country?: 'united-kingdom' | 'united-states' | 'canada' | 'uk' | 'usa' | 'us' | 'ca';
}

const CoreArea4: FC<CoreArea4Props> = ({ charityId, country = 'united-kingdom' }) => {
    const router = useRouter();

    const currentForm = React.useMemo(() => {
        const countryMap: Record<string, 'united-kingdom' | 'united-states' | 'canada'> = {
            'united-kingdom': 'united-kingdom',
            'united-states': 'united-states',
            'canada': 'canada',
            'uk': 'united-kingdom',
            'usa': 'united-states',
            'us': 'united-states',
            'ca': 'canada'
        };
        const mappedCountry = countryMap[country] || 'united-kingdom';
        return CORE_AREA_4_FORMS.find(f => f.countryCode === mappedCountry) || CORE_AREA_4_FORMS[0];
    }, [country]);

    // State for form data
    const [formVals, setFormVals] = React.useState<Record<string, any>>({});

    const updateFormData = (field: string, value: any) => {
        setFormVals(prev => ({
            ...prev,
            [field]: value
        }));
    }

    // Prefill logic
    React.useEffect(() => {
        const fetchAudit = async () => {
            if (!charityId) return;
            try {
                const { getAuditAction } = await import('@/app/actions/audits');
                const res = await getAuditAction(charityId, 4);

                if (res.ok && res.payload?.data?.data?.answers) {
                    const answers = res.payload.data.data.answers;
                    const newFormData: Record<string, any> = {};

                    const toSnakeCase = (str: string) =>
                        str.toLowerCase()
                            .replace(/[?]/g, '') // remove question marks
                            .replace(/[()]/g, '')
                            .replace(/['’]/g, '') // remove apostrophes
                            .trim()
                            .replace(/\s+/g, '_');

                    currentForm.questions.forEach(q => {
                        const key = toSnakeCase(q.label);
                        const ans = answers[key];
                        if (ans !== undefined && ans !== null) {
                            // API returns snake_case (e.g. "yes"), but form options are Title Case (e.g. "Yes")
                            // Find the matching option by converting option label to snake_case
                            const matchingOption = q.options.find(opt => toSnakeCase(opt.label) === ans);
                            if (matchingOption) {
                                newFormData[q.code] = matchingOption.label;
                            } else {
                                // Fallback: just use the raw answer (might work if matching, or just show nothing)
                                newFormData[q.code] = ans;
                            }
                        }
                    });

                    if (Object.keys(newFormData).length > 0) {
                        setFormVals(prev => ({ ...prev, ...newFormData }));
                    }
                }
            } catch (error) {
                console.error("Failed to fetch audit draft", error);
            }
        };

        fetchAudit();
    }, [charityId, currentForm]);

    const renderQuestion = (question: Question) => {
        const fieldCode = question.code;

        // Currently all are radio, but structure allows extension
        if (question.type === 'radio') {
            return (
                <SingleRadioQuestion
                    key={question.id}
                    id={question.id}
                    label={question.label}
                    options={question.options.map(opt => ({ label: opt.label, value: opt.label }))}
                    value={formVals[fieldCode] || ""}
                    onChange={(newVal) => updateFormData(fieldCode, newVal)}
                />
            );
        }
        return null;
    }


    // Helper to convert label to snake_case
    const toSnakeCaseConverted = (str: string) =>
        str.toLowerCase()
            .replace(/[?]/g, '') // remove question marks
            .replace(/[()]/g, '')
            .replace(/['’]/g, '') // remove apostrophes (both straight and curly)
            .trim()
            .replace(/\s+/g, '_');

    const handleSaveDraft = async () => {
        const answers: Record<string, any> = {};
        currentForm.questions.forEach(q => {
            const key = toSnakeCaseConverted(q.label);
            const val = formVals[q.code];
            if (val !== undefined && val !== null && val !== "") {
                // Convert value to snake_case as well (e.g. "Yes" -> "yes", "3 or more" -> "3_or_more")
                answers[key] = toSnakeCaseConverted(val);
            }
        });

        if (Object.keys(answers).length > 0) {
            try {
                const { submitAuditAction } = await import('@/app/actions/audits');
                await submitAuditAction({
                    charityId,
                    coreArea: 4,
                    answers
                });
            } catch (e) {
                console.error("Failed to save draft", e);
            }
        }
    }

    return (
        <>
            <div className="flex flex-col gap-4">
                <TypographyComponent variant="h3">{currentForm.title}</TypographyComponent>
                {currentForm.questions.map(question => renderQuestion(question))}
            </div>

            <div className='flex gap-4 mb-8 mt-8'>
                <Button className="w-36" variant='primary'
                    disabled={currentForm.questions.some(q => q.required && !formVals[q.code])}
                    onClick={async () => {
                        // Pass current country for consistency in preview/next steps
                        if (typeof window !== 'undefined') {
                            localStorage.setItem(`audit-form-data-${charityId}-core-area-4`, JSON.stringify(formVals));
                        }

                        await handleSaveDraft();

                        router.push(`/charities/${charityId}/audits/core-area-4?preview-mode=true&country=${country}`)
                    }}>Preview</Button>
                <Button className="w-36" variant={'outline'}>Cancel</Button>
            </div>
        </>
    );
}

export default CoreArea4
