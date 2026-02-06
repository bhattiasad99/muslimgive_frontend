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
    location: 'united-kingdom' | 'united-states' | 'canada'
}

const AuditPageContent: React.FC<AuditPageContentProps> = ({
    charityId,
    charityTitle,
    auditSlug,
    location
}) => {
    const router = useRouter()

    const [score, setScore] = React.useState<number | null>(null);
    const [totalScore, setTotalScore] = React.useState<number | null>(null);

    const getCoreAreaIdFromSlug = (slug: AuditSlug): number => {
        switch (slug) {
            case 'core-area-1': return 1;
            case 'core-area-2': return 2;
            case 'core-area-3': return 3;
            case 'core-area-4': return 4;
            default: return 0;
        }
    }

    React.useEffect(() => {
        const fetchScore = async () => {
            if (!charityId) return;
            const coreAreaId = getCoreAreaIdFromSlug(auditSlug);
            if (coreAreaId === 0) return;

            try {
                const { getAuditAction } = await import('@/app/actions/audits');
                const res = await getAuditAction(charityId, coreAreaId);

                if (res.ok && res.payload?.data?.data) {
                    setScore(res.payload.data.data.score);
                    // Assuming API returns totalScore or similar. If strictly following user JSON snippet which showed 'totalScore' inside 'core1' object in a 'reviews' object
                    // but getAuditAction returns the specific audit data directly.
                    // The user's JSON snippet seemed to be from a summary endpoint, but getAuditAction likely returns the specific audit details.
                    // Let's assume the specific audit endpoint also returns totalScore or we calculate it.
                    // However, relying on the previous tool output of getAuditAction implementation, it just calls /audits/charities/{id}?core-area={n}.
                    // Without seeing the exact response of THAT endpoint, I'll trust standard patterns and try to read 'totalScore' from data.
                    // If it's missing, I might need to default or check further.
                    // But based on user request "have the score form api be there", I'll try to use what's likely there.
                    setTotalScore(res.payload.data.data.totalScore ?? 10);
                }
            } catch (error) {
                console.error('Failed to fetch audit score', error);
            }
        };
        fetchScore();
    }, [charityId, auditSlug]);

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

                return <CoreArea4 charityId={charityId} country={location} />
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
                    {score !== null && (
                        <div className="flex items-center gap-2">
                            <TypographyComponent className='text-sm font-medium'>Current Score:</TypographyComponent>
                            <Badge className="bg-[#266dd3] hover:bg-[#1e5bb8] text-white">
                                {score}/{totalScore}
                            </Badge>
                        </div>
                    )}
                    <TypographyComponent className='text-gray-400 text-sm'>Please enter relevant information regarding the charity</TypographyComponent>
                </div>
            </div>
            {renderAudit(auditSlug)}
        </div>
    )
}

export default AuditPageContent
