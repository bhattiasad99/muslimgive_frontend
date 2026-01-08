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
                <Button className="w-full sm:w-36" variant='primary' onClick={() => {
                    if (step < 4) {
                        handleNext()
                    }
                    else {
                        router.push(`/charities/${charityId}/audits/core-area-2?preview-mode=true`)
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
