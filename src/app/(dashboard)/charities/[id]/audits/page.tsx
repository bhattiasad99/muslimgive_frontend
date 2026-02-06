'use client'
import React, { useState, useEffect } from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { AuditIds, GradeType, AuditStatus } from '@/DUMMY_AUDIT_VALS'
import AccordionHeader from './AccordionHeader'
import Preview from '@/components/use-case/SingleAuditPageComponent/Audits/Preview'
import { AUDIT_DEFINITIONS } from '@/components/use-case/SingleAuditPageComponent/AUDIT_DEFINITIONS'
import { usePathname } from 'next/navigation'
import { kebabToTitle } from '@/lib/helpers'
import { getCharityAction } from '@/app/actions/charities'

type CoreAreaReview = {
    status: 'pending' | 'in_progress' | 'submitted' | 'completed' | 'draft';
    score: number | null;
    totalScore: number;
    result: 'pass' | 'fail' | null;
}

type CharityReviews = {
    eligibility: string;
    core1: CoreAreaReview;
    core2: CoreAreaReview;
    core3: CoreAreaReview;
    core4: CoreAreaReview;
    summary: {
        completed: number;
        total: number;
    };
}

const AuditHistoryPage = () => {
    const [openId, setOpenId] = useState<string | null>(null)
    const [reviews, setReviews] = useState<CharityReviews | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [country, setCountry] = useState<'united-kingdom' | 'united-states' | 'canada'>('united-states')

    const auditKeys: AuditIds[] = ['core-area-1', 'core-area-2', 'core-area-3', 'core-area-4'];

    const pathname = usePathname();
    const charityId = pathname.split('/')[2];

    useEffect(() => {
        const fetchCharityData = async () => {
            try {
                setIsLoading(true)
                const response = await getCharityAction(charityId)
                if (response.ok && response.payload?.data?.data) {
                    const charityData = response.payload.data.data
                    setReviews(charityData.reviews)
                    const raw = String(charityData.countryCode || 'united-states').toLowerCase()
                    const normalized = raw === 'uk' || raw === 'united kingdom' || raw === 'united-kingdom'
                        ? 'united-kingdom'
                        : raw === 'usa' || raw === 'us' || raw === 'united states' || raw === 'united-states'
                            ? 'united-states'
                            : raw === 'ca' || raw === 'canada'
                                ? 'canada'
                                : 'united-states'
                    setCountry(normalized)
                }
            } catch (error) {
                console.error('Error fetching charity data:', error)
            } finally {
                setIsLoading(false)
            }
        }

        if (charityId) {
            fetchCharityData()
        }
    }, [charityId])

    const mapStatusToAuditStatus = (status: string): AuditStatus => {
        switch (status) {
            case 'pending':
                return 'pending'
            case 'in_progress':
                return 'in-progress'
            case 'submitted':
            case 'completed':
                return 'submitted'
            case 'draft':
                return 'draft'
            default:
                return 'pending'
        }
    }

    const calculateGrade = (score: number | null, totalScore: number): GradeType => {
        if (score === null) return 'F'
        const percentage = (score / totalScore) * 100
        if (percentage >= 90) return 'A'
        if (percentage >= 80) return 'B'
        if (percentage >= 70) return 'C'
        if (percentage >= 60) return 'D'
        return 'F'
    }

    const getCoreAreaData = (auditKey: AuditIds) => {
        if (!reviews) return null

        const coreAreaMap: Record<AuditIds, keyof Pick<CharityReviews, 'core1' | 'core2' | 'core3' | 'core4'>> = {
            'core-area-1': 'core1',
            'core-area-2': 'core2',
            'core-area-3': 'core3',
            'core-area-4': 'core4'
        }

        const coreAreaKey = coreAreaMap[auditKey]
        const coreAreaData = reviews[coreAreaKey]

        const normalizedScore = coreAreaData.totalScore > 0
            ? Math.round(((coreAreaData.score ?? 0) / coreAreaData.totalScore) * 100)
            : 0;

        return {
            status: mapStatusToAuditStatus(coreAreaData.status),
            score: normalizedScore,
            grade: calculateGrade(coreAreaData.score, coreAreaData.totalScore),
            result: coreAreaData.result
        }
    }

    if (isLoading) {
        return <div className="p-4">Loading...</div>
    }

    if (!reviews) {
        return <div className="p-4">No audit data available</div>
    }

    return (
        <Accordion type="single" collapsible>
            {auditKeys.map((eachAudit) => {
                const isOpen = openId === eachAudit
                const close = () => setOpenId(null)
                const auditData = getCoreAreaData(eachAudit)

                if (!auditData) return null

                return (
                    <AccordionItem key={eachAudit} value={eachAudit}>
                        <AccordionTrigger asChild className="w-full">
                            <AccordionHeader {...{
                                close,
                                title: kebabToTitle(eachAudit),
                                subTitle: AUDIT_DEFINITIONS[eachAudit].title.split('(')[0].trim(),
                                grade: auditData.grade,
                                result: auditData.result,
                                score: auditData.score,
                                status: auditData.status,
                                isOpen: isOpen,
                                setOpenId: setOpenId
                            }}
                            />
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="p-4">
                                <Preview
                                    status={auditData.status}
                                    showModeAndBackBtn={false}
                                    charityTitle={AUDIT_DEFINITIONS[eachAudit].title}
                                    auditSlug={eachAudit}
                                    country={country}
                                    charityId={charityId}
                                />
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )
            })}
        </Accordion>
    )
}

export default AuditHistoryPage;
