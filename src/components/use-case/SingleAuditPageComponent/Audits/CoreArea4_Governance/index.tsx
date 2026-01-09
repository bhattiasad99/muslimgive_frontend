import React, { FC } from 'react'
import SingleRadioQuestion from './SingleRadioQuestion'
import { CORE_AREA_4_FORMS } from '@/lib/audit-forms/core-area-4';
import { Question } from '@/lib/audit-forms/types';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation'
import { TypographyComponent } from '@/components/common/TypographyComponent';

type CoreArea4Props = {
    charityId: string;
    country?: 'uk' | 'usa' | 'ca';
}

const CoreArea4: FC<CoreArea4Props> = ({ charityId, country = 'uk' }) => {
    const router = useRouter();

    const currentForm = React.useMemo(() => {
        const countryMap: Record<string, 'uk' | 'usa' | 'canada'> = {
            'uk': 'uk',
            'usa': 'usa',
            'ca': 'canada'
        };
        const mappedCountry = countryMap[country] || 'uk';
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


    return (
        <>
            <div className="flex flex-col gap-4">
                <TypographyComponent variant="h3">{currentForm.title}</TypographyComponent>
                {currentForm.questions.map(question => renderQuestion(question))}
            </div>

            <div className='flex gap-4 mb-8 mt-8'>
                <Button className="w-36" variant='primary'
                    disabled={currentForm.questions.some(q => q.required && !formVals[q.code])}
                    onClick={() => {
                        // Pass current country for consistency in preview/next steps
                        router.push(`/charities/${charityId}/audits/core-area-2?preview-mode=true&country=${country}`)
                    }}>Preview</Button>
                <Button className="w-36" variant={'outline'}>Cancel</Button>
            </div>
        </>
    );
}

export default CoreArea4
