'use client'
import React, { FC, useState } from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { AuditIds, DUMMY_AUDIT_VALUES } from '@/DUMMY_AUDIT_VALS'
import AccordionHeader from './AccordionHeader'
import Preview from '@/components/use-case/SingleAuditPageComponent/Audits/Preview'
import { AUDIT_DEFINITIONS } from '@/components/use-case/SingleAuditPageComponent/AUDIT_DEFINITIONS'
import { DUMMY_CHARITIES } from '@/DUMMY_CHARITIES'
import { usePathname } from 'next/navigation'
import { kebabToTitle } from '@/lib/helpers'

const AuditHistoryPage = () => {
    const [openId, setOpenId] = useState<string | null>(null)

    const auditVals = DUMMY_AUDIT_VALUES;

    const auditKeys: AuditIds[] = ['core-area-1', 'core-area-2', 'core-area-3', 'core-area-4'];

    const pathname = usePathname();

    const charityId = pathname.split('/')[2];

    return (
        <Accordion type="single" collapsible>
            {auditKeys.map((eachAudit) => {
                const isOpen = openId === eachAudit
                const close = () => setOpenId(null)

                return (
                    <AccordionItem key={eachAudit} value={eachAudit}>
                        <AccordionTrigger asChild className="w-full">
                            <AccordionHeader {...{
                                close,
                                title: kebabToTitle(eachAudit),
                                subTitle: AUDIT_DEFINITIONS[eachAudit].title.split('(')[0].trim(),
                                grade: auditVals[eachAudit].grade,
                                score: auditVals[eachAudit].score,
                                status: auditVals[eachAudit].status,
                                isOpen: isOpen,
                                setOpenId: setOpenId
                            }}
                            />
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="p-4">
                                <Preview
                                    status={auditVals[eachAudit].status}
                                    showModeAndBackBtn={false}
                                    charityTitle={AUDIT_DEFINITIONS[eachAudit].title}
                                    auditSlug={eachAudit} country={DUMMY_CHARITIES.find(eachCharity => eachCharity.id === charityId)?.country || 'usa'}
                                    auditedBy={auditVals[eachAudit].auditedBy ? auditVals[eachAudit].auditedBy : undefined}
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
