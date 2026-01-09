import React, { FC, useMemo, useState } from 'react'
import SingleSectionQuestion from '../../SingleSectionQuestion'
import AuditSectionCard from '../../UI/AuditSectionCard'
import RadioGroupComponent from '@/components/common/RadioGroupComponent'
import DatePicker from '@/components/common/ControlledDatePickerComponent'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { CORE_AREA_2_FORMS } from '@/lib/audit-forms/core-area-2'
import { Question } from '@/lib/audit-forms/types'

type IProps = {
    location: 'ca' | 'uk' | 'usa';
    charityId: string;
}

const CoreArea2: FC<IProps> = ({ location = 'usa', charityId }) => {
    const router = useRouter();
    const [formData, setFormData] = useState<Record<string, any>>({});

    const formDefinition = useMemo(() => {
        let countryCode = location
        if (location === 'ca') countryCode = 'canada' as any

        return CORE_AREA_2_FORMS.find(f => f.countryCode === countryCode) || CORE_AREA_2_FORMS.find(f => f.countryCode === 'usa')
    }, [location])


    const updateFormData = (field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    // Prefill logic
    React.useEffect(() => {
        const fetchAudit = async () => {
            if (!charityId || !formDefinition) return;
            try {
                const { getAuditAction } = await import('@/app/actions/audits');
                const res = await getAuditAction(charityId, 2);

                if (res.ok && res.payload?.data?.data?.answers) {
                    const answers = res.payload.data.data.answers;
                    const newFormData: Record<string, any> = {};

                    const toSnakeCase = (str: string) =>
                        str.toLowerCase()
                            .replace(/[?]/g, '') // remove question marks
                            .replace(/[()]/g, '')
                            .replace(/%/g, '') // remove %
                            .replace(/\//g, '') // remove forward slashes
                            .trim()
                            .replace(/[\s-]+/g, '_'); // replace spaces and hyphens with underscore

                    formDefinition.questions.forEach(q => {
                        const key = toSnakeCase(q.label);
                        const ans = answers[key];
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
                console.error("Failed to fetch audit draft", error);
            }
        };

        fetchAudit();
    }, [charityId, formDefinition]);

    if (!formDefinition) return <div>Form not found for location: {location}</div>

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
                return (
                    <SingleSectionQuestion
                        key={question.id}
                        type="text" // reusing text for number for now as SingleSectionQuestion supports it via props if we adjust, or just text input
                        heading={question.label}
                        id={`core_2__${fieldCode}`}
                        required={question.required}
                        onInputChange={(_name, value) => updateFormData(fieldCode, value)}
                        inputProps={{
                            type: question.type === 'number' ? 'number' : 'text',
                            value: formData[fieldCode] || ''
                        }}
                    />
                )
            case 'radio':
                return (
                    <AuditSectionCard key={question.id}>
                        <RadioGroupComponent
                            value={formData[fieldCode] || ''}
                            onChange={(newVal) => updateFormData(fieldCode, newVal)}
                            label={question.label}
                            labelClassNames='text-sm'
                            name={`core_2__${fieldCode}`}
                            required={question.required}
                            options={question.options.map(opt => ({
                                label: opt.label,
                                value: opt.label // Using label as value based on options logic often seen, or we should use ID? Usually string value 'Yes'/'No'
                            }))}
                        />
                    </AuditSectionCard>
                )
            case 'date':
                return (
                    <AuditSectionCard key={question.id}>
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
                    </AuditSectionCard>
                )
            case 'paragraph':
            case 'textarea' as any: // Handle if type comes as textarea
                return (
                    <SingleSectionQuestion
                        key={question.id}
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

    // Helper to convert label to snake_case
    const toSnakeCaseConverted = (str: string) =>
        str.toLowerCase()
            .replace(/[?]/g, '') // remove question marks
            .replace(/[()]/g, '')
            .replace(/%/g, '') // remove %
            .replace(/\//g, '') // remove forward slashes
            .trim()
            .replace(/[\s-]+/g, '_'); // replace spaces and hyphens with underscore

    const handleSaveDraft = async () => {
        const answers: Record<string, any> = {};
        if (!formDefinition) return;

        formDefinition.questions.forEach(q => {
            const key = toSnakeCaseConverted(q.label);
            const val = formData[q.code];
            if (val !== undefined && val !== null && val !== "") {
                if (q.type === 'number') {
                    // Ensure we send a number, parse float/int
                    const num = Number(val);
                    if (!isNaN(num)) {
                        answers[key] = num;
                    }
                } else if (q.type === 'date' && val instanceof Date) {
                    // Format date as YYYY-MM-DD
                    answers[key] = val.toISOString().split('T')[0];
                } else {
                    answers[key] = val;
                }
            }
        });

        if (Object.keys(answers).length > 0) {
            try {
                const { submitAuditAction } = await import('@/app/actions/audits');
                await submitAuditAction({
                    charityId,
                    coreArea: 2,
                    answers
                });
            } catch (e) {
                console.error("Failed to save draft", e);
            }
        }
    }

    return (
        <>
            <div className='flex flex-col gap-6'>
                {formDefinition.questions.map(q => renderQuestion(q))}
            </div>

            {/* Action Buttons */}
            <div className='flex flex-col gap-3 mb-8 mt-8 sm:flex-row sm:items-center sm:gap-4'>
                <Button className="w-full sm:w-36" variant='primary' onClick={async () => {
                    if (typeof window !== 'undefined') {
                        localStorage.setItem(`audit-form-data-${charityId}-core-area-2`, JSON.stringify(formData));
                    }

                    await handleSaveDraft();

                    router.push(`/charities/${charityId}/audits/core-area-2?preview-mode=true&country=${location}`)
                }}>Preview</Button>
                <Button className="w-full sm:w-36" variant={'outline'}>Cancel</Button>
            </div>
        </>
    )
}

export default CoreArea2
