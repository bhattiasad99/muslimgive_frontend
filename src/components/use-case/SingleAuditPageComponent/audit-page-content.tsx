'use client'

import ArrowIcon from '@/components/common/IconComponents/ArrowIcon'
import { TypographyComponent } from '@/components/common/TypographyComponent'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React from 'react'
import { type AuditSlug } from './AUDIT_DEFINITIONS'
import CoreArea1 from './Audits/CoreArea1_CharityStatus'
import CoreArea2 from './Audits/CoreArea2_FinancialAccountability'
import CoreArea3 from './Audits/CoreArea3_Zakat'
import CoreArea4 from './Audits/CoreArea4_Governance'


type AuditPageContentProps = {
    charityId: string;
    charityTitle: string;
    auditSlug: AuditSlug;
    auditTitle: string;
    auditDescription: string;
    location: 'ca' | 'uk' | 'usa'
}

const AuditPageContent: React.FC<AuditPageContentProps> = ({
    charityId,
    charityTitle,
    auditSlug,
    location
}) => {
    const router = useRouter()

    const renderAudit = (auditId: AuditSlug) => {
        switch (auditId) {
            case "core-area-1": {
                return <CoreArea1 charityId={charityId} country={location} />
            }
            case "core-area-2": {
                return <CoreArea2 charityId={charityId} location={location} />
            }
            case "core-area-3": {
                return <CoreArea3 charityId={charityId} />
            }
            case 'core-area-4': {

                return <CoreArea4 charityId={charityId} />
            }
        }
    }

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
                    <TypographyComponent className='text-gray-400 text-sm'>Please enter relevant information regarding the charity</TypographyComponent>
                </div>
            </div>
            {renderAudit(auditSlug)}
        </div>
    )
}

export default AuditPageContent
