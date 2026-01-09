
import React, { FC, useMemo, useState } from 'react'
import SingleSectionQuestion from '../../SingleSectionQuestion'
import { Link } from 'lucide-react'
import AuditSectionCard from '../../UI/AuditSectionCard'
import RadioGroupComponent from '@/components/common/RadioGroupComponent'
import { TypographyComponent } from '@/components/common/TypographyComponent'
import DatePicker from '@/components/common/ControlledDatePickerComponent'
import { Label } from '@/components/ui/label'
import SelectComponent from '@/components/common/SelectComponent'
import { ControlledTextFieldComponent } from '@/components/common/TextFieldComponent/ControlledTextFieldComponent'
import ControlledFileUploadComponent, { UploadedItem } from '@/components/common/FileUploadComponent/ControlledFileUploadComponent'
import { Button } from '@/components/ui/button'
import { isValidUrl } from '@/lib/helpers'
import { useRouter } from 'next/navigation'
import { CORE_AREA_1_FORMS } from '@/lib/audit-forms/core-area-1'
import { Question } from '@/lib/audit-forms/types'


export type FileStatusEvidence = {
    type: 'file';
    fileInfo: UploadedItem | null;
}

export type LinkStatusEvidence = {
    type: 'link';
    linkUrl: string;
}

// We use a flexible type for form data since fields depend on the country
type FormDataType = Record<string, any>;

const INITIAL_FORM_DATA: FormDataType = {}

type CoreArea1Props = {
    charityId: string;
    country?: 'uk' | 'usa' | 'ca';
}

const CoreArea1: FC<CoreArea1Props> = ({ charityId, country = 'uk' }) => {
    const router = useRouter()
    const [formData, setFormData] = useState<FormDataType>(INITIAL_FORM_DATA)
    const [linkBlurred, setLinkBlurred] = useState<Record<string, boolean>>({})

    const currentForm = useMemo(() => {
        // Map app country codes to form definition country codes
        const countryMap: Record<string, 'uk' | 'usa' | 'canada'> = {
            'uk': 'uk',
            'usa': 'usa',
            'ca': 'canada'
        };
        const mappedCountry = countryMap[country] || 'uk';
        return CORE_AREA_1_FORMS.find(f => f.countryCode === mappedCountry) || CORE_AREA_1_FORMS[0];
    }, [country]);

    const updateFormData = (field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    // Prefill logic
    React.useEffect(() => {
        const fetchAudit = async () => {
            if (!charityId) return;
            try {
                // Fetch Core Area 1
                // We need to import getAuditAction. Since it's a default export from actions/audits is not possible, we use named import logic if I imported it efficiently?
                // Checking imports... I need to add import first.
                // Assuming I will add the import in a separate block or included here if the tool allows.
                // I will use dynamic import or just add the import at the top in a separate step if needed, but replace_file_content works on blocks.
                // I'll add the logic here and rely on TypeScript to tell me if I missed import, then fix it.
                // Actually I should add import line at the top first.

                // Fetching...
                const { getAuditAction } = await import('@/app/actions/audits');
                const res = await getAuditAction(charityId, 1);

                if (res.ok && res.payload?.data?.data?.answers) {
                    const answers = res.payload.data.data.answers;
                    const newFormData: FormDataType = {};

                    // Helper to convert label to snake_case to match API keys
                    const toSnakeCase = (str: string) =>
                        str.toLowerCase()
                            .replace(/[()]/g, '') // remove parens
                            .trim()
                            .replace(/\s+/g, '_'); // replace spaces with underscore

                    currentForm.questions.forEach(q => {
                        const key = toSnakeCase(q.label);
                        // Check if we have a specific override for this question
                        let ans = answers[key];

                        if (q.code === "CS11" && !ans) {
                            // CS11 (Status Evidence Link) maps to 'evidence_link_if_applicable'
                            ans = answers['evidence_link_if_applicable'];
                        }

                        if (ans !== undefined && ans !== null) {
                            // Handle file/date/radio mapping if needed
                            if (q.type === 'file' && typeof ans === 'string') {
                                // If it's a string URL (which fits the new CS11 text input usage), just use it string.
                                // BUT wait, if CS11 is rendered as TEXT now, we can just assign the string directly!
                                // We changed CS11 to render as text in 'renderQuestion', so we should treat it as text data here.

                                if (q.code === 'CS11') {
                                    newFormData[q.code] = ans;
                                } else {
                                    // Legacy file handling for other file fields or if CS11 was still file
                                    newFormData[q.code] = {
                                        type: 'file',
                                        fileInfo: {
                                            name: 'Uploaded Evidence',
                                            url: ans,
                                            size: 0,
                                            type: 'application/octet-stream'
                                        }
                                    };
                                }
                            } else if (q.type === 'date' && typeof ans === 'string') {
                                // Convert date string to Date object
                                const dateObj = new Date(ans);
                                if (!isNaN(dateObj.getTime())) {
                                    newFormData[q.code] = dateObj;
                                }
                            } else {
                                newFormData[q.code] = ans;
                            }
                        }
                    });

                    // Only update if we found answers
                    if (Object.keys(newFormData).length > 0) {
                        setFormData(prev => ({ ...prev, ...newFormData }));
                    }
                }
            } catch (error) {
                console.error("Failed to fetch audit draft", error);
            }
        };

        fetchAudit();
    }, [charityId, currentForm]);

    const handleUpload = async (incoming: File[], fieldCode: string) => {
        const mapped = incoming.map((f) => ({
            id: crypto.randomUUID(),
            name: f.name,
            size: f.size,
            type: f.type,
            file: f,
        }));

        updateFormData(fieldCode, {
            type: 'file',
            fileInfo: mapped[0]
        })
    };

    const renderQuestion = (question: Question) => {
        const fieldCode = question.code; // e.g., CS01

        // Helper logic to check dependencies (scoreLogic-like conditions for visibility)
        // Simplified check based on "Evidence for Pending Registration" dependency
        if (question.code === 'CS06' && formData['CS03'] !== 'Pending Registration') return null; // Logic from JSON

        // User Request: Remove Status Evidence Type (CS10) box completely.
        if (question.code === 'CS10') return null;

        // User Request: Remove Status Evidence File (CS11) completely (rendered inside CS09 card instead).
        if (question.code === 'CS11') return null;

        // User Request: Hide standalone "Evidence Link (if applicable)" field (CS07 UK, CS06 US/CA)
        // We're already showing "Status Evidence Link" inside the Registration Date card
        if (question.label === 'Evidence Link (if applicable)') return null;

        switch (question.type) {
            case 'text':
                try {
                    // Specific handling for link fields to add the link icon
                    if (question.label.toLowerCase().includes('link')) {
                        return (
                            <SingleSectionQuestion
                                key={question.id}
                                heading={question.label}
                                type='text'
                                id={`core_1__${fieldCode}`}
                                required={question.required}
                                inputProps={{
                                    type: 'text',
                                    value: formData[fieldCode] || '',
                                    onChange: (e: any) => updateFormData(fieldCode, e.target.value),
                                    icon: {
                                        component: <Link size={14} color="#266dd3" />,
                                        direction: 'left'
                                    }
                                }}
                            />
                        )
                    }
                    return (
                        <SingleSectionQuestion
                            key={question.id}
                            heading={question.label}
                            type='text'
                            id={`core_1__${fieldCode}`}
                            required={question.required}
                            inputProps={{
                                type: 'text', // Fallback to text, though CS01 might be number for UK but text for others
                                value: formData[fieldCode] || '',
                                onChange: (e: any) => updateFormData(fieldCode, e.target.value),
                            }}
                        />
                    )
                } catch (e) { return null }

            case 'radio':
                try {
                    return (
                        <AuditSectionCard key={question.id}>
                            <RadioGroupComponent
                                value={formData[fieldCode]}
                                onChange={(newVal) => updateFormData(fieldCode, newVal)}
                                label={question.label}
                                labelClassNames='text-sm'
                                name={`core_1__${fieldCode}`}
                                required={question.required}
                                options={question.options.map(opt => ({ label: opt.label, value: opt.label }))} // Using label as value for simplicity based on JSON scoreLogic
                            />
                        </AuditSectionCard>
                    )
                } catch (e) { return null }

            case 'date':
                try {
                    // Group CS09 (Date) and CS11 (Evidence Link) into one card per user request
                    if (fieldCode === 'CS09') {
                        // Hide this card if Registration Status is 'Registered'
                        if (formData['CS03'] === 'Registered') return null;

                        const cs11 = currentForm.questions.find(q => q.code === 'CS11');
                        return (
                            <AuditSectionCard key={question.id}>
                                <div className="flex flex-col gap-6">
                                    {/* Registration Date */}
                                    <div className="flex flex-col gap-2">
                                        <TypographyComponent className='font-semibold text-sm'>
                                            {question.label}
                                        </TypographyComponent>
                                        <DatePicker
                                            disabledFutureDates
                                            label={question.label}
                                            onChange={(date) => updateFormData(fieldCode, date ?? null)}
                                            value={formData[fieldCode] ?? undefined}
                                        />
                                    </div>

                                    {/* Status Evidence Link (CS11) */}
                                    {cs11 && (
                                        <div className="flex flex-col gap-2">
                                            <TypographyComponent className='font-semibold text-sm'>
                                                Status Evidence Link (if applicable)
                                            </TypographyComponent>
                                            <ControlledTextFieldComponent
                                                type='text'
                                                value={formData['CS11'] || ''}
                                                onChange={(e: any) => updateFormData('CS11', e.target.value)}
                                                icon={{
                                                    component: <Link size={14} color="#266dd3" />,
                                                    direction: 'left'
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </AuditSectionCard>
                        );
                    }

                    return (
                        <div key={question.id} className="flex flex-col gap-2 mb-4">
                            <TypographyComponent className='font-semibold text-sm'>
                                {question.label}
                            </TypographyComponent>
                            <DatePicker
                                disabledFutureDates
                                label={question.label}
                                onChange={(date) => updateFormData(fieldCode, date ?? null)}
                                value={formData[fieldCode] ?? undefined}
                            />
                        </div>
                    )
                } catch (e) { return null }

            case 'file':
                try {
                    // Skip CS11 here as it is rendered with CS09
                    if (fieldCode === 'CS11') return null;

                    return (
                        <div key={question.id} className="flex flex-col gap-2 mb-4">
                            <Label htmlFor={`core_1__${fieldCode}`} className="block text-sm font-semibold w-full sm:w-1/2">{question.label}</Label>
                            <ControlledFileUploadComponent
                                required={question.required}
                                value={formData[fieldCode]?.fileInfo ? [formData[fieldCode].fileInfo] : []}
                                onFileUpload={(files) => handleUpload(files, fieldCode)}
                                onRemove={() => updateFormData(fieldCode, null)}
                                limit={1}
                                disabled={formData[fieldCode]?.fileInfo !== undefined && formData[fieldCode]?.fileInfo !== null}
                            />
                        </div>
                    )
                } catch (e) { return null }

            case 'paragraph':
                try {
                    return (
                        <SingleSectionQuestion
                            key={question.id}
                            type="textarea"
                            heading={question.label}
                            lines={6}
                            id={`core_1__${fieldCode}`}
                            required={question.required}
                            value={formData[fieldCode] || ''}
                            onInputChange={(_name, value) => updateFormData(fieldCode, value)}
                        />
                    )
                } catch (e) { return null }

            default:
                return null;
        }
    }

    // Helper to convert label to snake_case
    const toSnakeCaseConverted = (str: string) =>
        str.toLowerCase()
            .replace(/[()]/g, '') // remove parens
            .trim()
            .replace(/\s+/g, '_'); // replace spaces with underscore

    const handleSaveDraft = async () => {
        const answers: Record<string, any> = {};
        currentForm.questions.forEach(q => {
            const key = toSnakeCaseConverted(q.label);
            const val = formData[q.code];

            // Special handling for CS06 - always include it (even as null)
            if (q.code === 'CS06') {
                answers['evidence_for_pending_registration_provided_yes_no'] = val || null;
                return;
            }

            if (val !== undefined && val !== null && val !== "") {
                if (q.code === 'CS11') {
                    // Map to 'evidence_link_if_applicable' as requested
                    answers['evidence_link_if_applicable'] = val;
                } else if (q.type === 'file' && val?.fileInfo?.url) {
                    // If it's a file and has a URL (already uploaded/prefilled), send the URL
                    answers[key] = val.fileInfo.url;
                } else if (q.type === 'file' && val?.fileInfo?.file) {
                    // new file upload logic - skipped for now
                } else if (q.type === 'date' && val instanceof Date) {
                    // Format date as YYYY-MM-DD
                    const year = val.getFullYear();
                    const month = String(val.getMonth() + 1).padStart(2, '0');
                    const day = String(val.getDate()).padStart(2, '0');
                    answers[key] = `${year}-${month}-${day}`;
                } else {
                    answers[key] = val;
                }
            }
        });

        console.log('Core Area 1 Draft Payload:', { charityId, coreArea: 1, answers });

        if (Object.keys(answers).length > 0) {
            try {
                const { submitAuditAction } = await import('@/app/actions/audits');
                await submitAuditAction({
                    charityId,
                    coreArea: 1,
                    answers
                });
            } catch (e) {
                console.error("Failed to save draft", e);
            }
        }
    }

    // Reorder questions to show Registration Date + Status Evidence Link right after Registration Status
    const reorderedQuestions = useMemo(() => {
        const questions = [...currentForm.questions];
        const cs03Index = questions.findIndex(q => q.code === 'CS03');
        const cs09Index = questions.findIndex(q => q.code === 'CS09');

        if (cs03Index !== -1 && cs09Index !== -1 && cs09Index > cs03Index) {
            // Remove CS09 from its current position
            const [cs09] = questions.splice(cs09Index, 1);
            // Insert it right after CS03
            questions.splice(cs03Index + 1, 0, cs09);
        }

        return questions;
    }, [currentForm.questions]);

    return (
        <>
            <div className="flex flex-col gap-4">
                <TypographyComponent variant="h3">{currentForm.title}</TypographyComponent>
                {reorderedQuestions.map(question => renderQuestion(question))}
            </div>

            <div className='flex flex-col gap-3 mb-8 mt-8 sm:flex-row sm:items-center sm:gap-4'>
                <Button className="w-full sm:w-36" variant='primary' onClick={async () => {
                    // Save to local storage for immediate preview usage
                    if (typeof window !== 'undefined') {
                        localStorage.setItem(`audit-form-data-${charityId}-core-area-1`, JSON.stringify(formData));
                    }

                    // Save to API as draft
                    await handleSaveDraft();

                    router.push(`/charities/${charityId}/audits/core-area-1?preview-mode=true&country=${country}`)
                }}>Preview</Button>
                <Button className="w-full sm:w-36" variant={'outline'}>Cancel</Button>
            </div>
        </>
    )
}

export default CoreArea1
