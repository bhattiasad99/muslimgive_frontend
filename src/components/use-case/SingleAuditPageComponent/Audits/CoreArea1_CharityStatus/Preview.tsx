'use client'
import { CountryCode } from '@/app/(dashboard)/charities/[id]/audits/[audit]/page'
import { AuditIds, AuditStatus, DUMMY_AUDIT_VALUES } from '@/DUMMY_AUDIT_VALS';
import React, { FC, useState } from 'react'
import PreviewValueLayout from '../../UI/PreviewValueLayout';
import LinkComponent from '@/components/common/LinkComponent';
import { capitalizeWords } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';
import ModelComponentWithExternalControl from '@/components/common/ModelComponent/ModelComponentWithExternalControl';
import SubmittedSymbol from './SubmittedSymbol';

export type PreviewPageCommonProps = {
    country: CountryCode;
    status: AuditStatus
}

type IProps = PreviewPageCommonProps;

const auditName: AuditIds = 'core-area-1'

const PreviewCoreArea1: FC<IProps> = ({ country, status }) => {
    const auditVals = DUMMY_AUDIT_VALUES[auditName];
    const [showSubmittedModel, setShowSubmittedModel] = useState(false);
    const router = useRouter();
    // get path from router
    const pathname = usePathname();
    const charityId = pathname.split('/')[2];
    return (
        <div className='flex flex-col gap-4'>

            <PreviewValueLayout label='Charity Number' result={`${auditVals.charityNumber}`} />
            <PreviewValueLayout label='Charity Commission Profile URL' result={<LinkComponent openInNewTab className='hover:underline text-primary' to={auditVals.charityCommissionProfileLink}>{auditVals.charityCommissionProfileLink}</LinkComponent>} />
            <PreviewValueLayout label="Registration Status" result={<span className='flex gap-2 items-center'><span>{capitalizeWords(auditVals.registrationStatus)}</span>
                {auditVals.statusEvidence?.type === 'link' ? <LinkComponent openInNewTab className='hover:underline text-primary' to={auditVals.statusEvidence.linkUrl}>View Evidence</LinkComponent> : null}
                {/* download the file on click */}
                {auditVals.statusEvidence?.type === 'file' ? <Button variant={'outline'} onClick={(e) => {
                    e.preventDefault();
                    if (auditVals.statusEvidence?.type === 'file') {
                        const link = document.createElement('a');
                        link.href = auditVals.statusEvidence.fileInfo?.url || '';
                        link.download = auditVals.statusEvidence.fileInfo?.name || 'evidence-file';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }
                }}>{auditVals.statusEvidence.type === 'file' ? capitalizeWords(auditVals.statusEvidence.fileInfo?.name ?? '') : ''}</Button> : null}
            </span>} />
            <PreviewValueLayout label='Gift Aid Eligibility' result={`${auditVals.eligibleForGiftAid ? 'Yes' : 'No'}`} />
            <PreviewValueLayout label='Link to Gift Aid Status' result={<LinkComponent openInNewTab className='hover:underline text-primary' to={auditVals.giftStatusEvidenceUrl}>{auditVals.giftStatusEvidenceUrl}</LinkComponent>} />
            <PreviewValueLayout orientation='vertical' label='Status Notes' result={auditVals.statusNotes} />
            {status === 'draft' ? <>
                <div className='flex gap-4 mb-8'>
                    <Button className="w-36" variant='primary' onClick={() => {
                        setShowSubmittedModel(true);

                        setTimeout(() => {
                            setShowSubmittedModel(false);
                            router.push(`/charities/${charityId}`)
                        }, 2000)
                    }}>Submit Form</Button>
                </div>
            </> : null}
            {status === 'in-progress' ? <>
                <div className='flex gap-4 mb-8'>
                    <Button className="w-36" variant='primary' onClick={() => {
                        router.push(`/charities/${charityId}/audits/core-area-1?country=${country}`)
                    }}>Continue Form</Button>
                </div>
            </> : null}
            <ModelComponentWithExternalControl open={showSubmittedModel} title='' onOpenChange={(openState) => setShowSubmittedModel(openState)}>
                <div className="flex flex-col gap-2 items-center">
                    <SubmittedSymbol />
                    <div className='font-semibold'>Audit Completed!</div>
                    <div className="text-sm">Navigating back to the Charity Page</div>
                </div>
            </ModelComponentWithExternalControl>
        </div>
    )
}

export default PreviewCoreArea1