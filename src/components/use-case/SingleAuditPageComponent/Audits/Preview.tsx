
import { CountryCode } from '@/app/(dashboard)/charities/[id]/audits/[audit]/page'
import ArrowIcon from '@/components/common/IconComponents/ArrowIcon'
import LinkComponent from '@/components/common/LinkComponent'
import { Button } from '@/components/ui/button'
import { AuditIds, DUMMY_AUDIT_VALUES } from '@/DUMMY_AUDIT_VALS'
import { camelCaseToTitle, capitalizeWords, formatToReadableWithTZ, isLikelyUrl } from '@/lib/helpers'
import { useRouter } from 'next/dist/client/components/navigation'
import React, { FC } from 'react'
import PreviewValueLayout from '../UI/PreviewValueLayout'
import PreviewCoreArea1 from './CoreArea1_CharityStatus/Preview'
import PreviewCoreArea2 from './CoreArea2_FinancialAccountability/Preview'
import PreviewCoreArea3 from './CoreArea3_Zakat/Preview'
import PreviewCoreArea4 from './CoreArea4_Governance/Preview'

type IProps = {
    charityTitle: string,
    auditedBy: {
        name: string,
        time: string
    },
    charityId: string,
    auditSlug: AuditIds,
    country: CountryCode
}

const Preview: FC<IProps> = ({ charityTitle, auditedBy, charityId, auditSlug, country }) => {
    const auditVals = DUMMY_AUDIT_VALUES[auditSlug] || null;
    if (!auditVals) {
        return <div>No audit values found for preview.</div>
    }

    const renderPreview = (auditId: AuditIds, country: CountryCode) => {
        switch (auditId) {
            case 'core-area-1':
                return <PreviewCoreArea1 country={country} />;
            case 'core-area-2':
                return <PreviewCoreArea2 country={country} />;
            case 'core-area-3':
                return <PreviewCoreArea3 country={country} />;
            case 'core-area-4':
                return <PreviewCoreArea4 country={country} />;
            default:
                return <div>No preview available for this audit.</div>;
        }
    }

    return (
        <div className='flex flex-col gap-6'>
            <div className="text-md text-[#666E76] italic font-medium">Preview Mode</div>
            <div>
                <LinkComponent to={`/charities/${charityId}/audits/${auditSlug}?country=${country}&preview-mode=false`}>
                    <Button

                        variant="secondary"
                        className="border-0 text-primary"
                    >
                        <ArrowIcon />
                        Back to Editing
                    </Button>
                </LinkComponent>
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-sm font-bold">Audited By: {capitalizeWords(auditedBy.name)}</p>
                <p className="text-sm">{formatToReadableWithTZ(auditedBy.time)}</p>
            </div>
            <div className="flex flex-col gap-4 text-sm">
                {renderPreview(auditSlug, country)}
            </div>
        </div >
    )
}

export default Preview