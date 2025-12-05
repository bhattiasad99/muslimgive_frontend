'use client'

import ArrowIcon from '@/components/common/IconComponents/ArrowIcon'
import { TypographyComponent } from '@/components/common/TypographyComponent'
import { Badge } from '@/components/ui/badge'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React, { useMemo, useState } from 'react'
import type { AuditSlug } from './audit-definitions'
import AuditSectionCard from './UI/AuditSectionCard'
import SingleSectionQuestion from './SingleSectionQuestion'
import RadioGroupComponent from '@/components/common/RadioGroupComponent'

type AuditStage = 'draft' | 'preview' | 'submitted'

const STAGE_DETAILS: Record<AuditStage, { label: string; description: string; placeholder: string }> = {
    draft: {
        label: 'Draft',
        description: 'Editable state where auditors capture evidence, notes, and uploads.',
        placeholder: 'Place form inputs, evidence uploads, and validation rules here. Save progress as needed.',
    },
    preview: {
        label: 'Preview',
        description: 'Read-only review of everything entered in the draft before final submission.',
        placeholder: 'Render a read-only summary or print-friendly preview of the draft content.',
    },
    submitted: {
        label: 'Submitted',
        description: 'Locked view after submission. Edits are disabled, but a confirmation/summary stays visible.',
        placeholder: 'Show submission confirmation, timestamps, and a summary of what was sent for review.',
    },
}

type AuditPageContentProps = {
    charityId: string;
    charityTitle: string;
    auditSlug: AuditSlug;
    auditTitle: string;
    auditDescription: string;
}

const AuditPageContent: React.FC<AuditPageContentProps> = ({
    charityId,
    charityTitle,
    auditSlug,
    auditTitle,
    auditDescription,
}) => {
    const router = useRouter()
    const [stage, setStage] = useState<AuditStage>('draft')
    const orderedStages: AuditStage[] = useMemo(() => ['draft', 'preview', 'submitted'], [])

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div>
                    <Button
                        onClick={() => router.push(`/charities/${charityId}`)}
                        variant="secondary"
                        className="border-0 text-primary"
                    >
                        <ArrowIcon />
                        Back to Charity Page
                    </Button>
                </div>
                <div className="flex flex-col gap-3">
                    <TypographyComponent variant='h2'>{charityTitle}</TypographyComponent>
                    <div className="flex gap-3">
                        <TypographyComponent>Current Score</TypographyComponent>
                        <Badge variant="default">5/10</Badge>
                    </div>
                    <TypographyComponent className='text-gray-400 text-sm'>Please enter relevant information regarding the charity</TypographyComponent>
                </div>
            </div>
            <SingleSectionQuestion heading='Enter Charity Number' type='text' id='core_1__charity-number' required={true} inputProps={{
                type: 'number'
            }} />
            <SingleSectionQuestion heading='Enter Charity Commission Profile Link' type='text' id='core_1__charity-commission-profile-link' required={true} inputProps={{
                type: 'text'
            }} />
            <AuditSectionCard>
                <div className="flex flex-col gap-4">
                    <RadioGroupComponent label="Registration Status" required={true} options={[
                        { label: 'Registered', value: 'registered' },
                        { label: 'Not Registered', value: 'not_registered' },
                        { label: 'Pending', value: 'pending' }
                    ]} />
                </div>
            </AuditSectionCard>
        </div>
    )
}

export default AuditPageContent
