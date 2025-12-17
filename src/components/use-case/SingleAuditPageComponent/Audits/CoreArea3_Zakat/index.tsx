'use client'
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import React, { useState } from 'react'
import { MULTI_STEP_DEFS, QuestionDef } from './MULTI_STEP_DEFS';
import Page from './Page';
import ComplexCheckboxGroup, { ComplexCheckboxGroupStatus, LinkAttached } from './ComplexCheckboxGroup';
import AuditSectionCard from '../../UI/AuditSectionCard';

type Steps = 0 | 1 | 2 | 3 | 4;

export type SingleFormPageCommonProps = {
    questions: QuestionDef[]
}

type FormEntry = ComplexCheckboxGroupStatus & {
    id: string;
}

const CoreArea3 = () => {
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
                                let temp = [...formEntries];
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
            <div className='flex gap-4 mb-8'>
                <Button className="w-36" variant='primary' onClick={() => {
                    if (step < 4) {
                        handleNext()
                    }
                }}>{step === 4 ? 'Preview' : 'Next'}</Button>
                <Button className="w-36" variant={'outline'} onClick={() => {
                    if (step > 0) {
                        handlePrev()
                    }
                }}>{step === 0 ? 'Cancel' : 'Back'}</Button>
            </div>
        </>
    )
}

export default CoreArea3