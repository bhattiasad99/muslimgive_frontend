import { CountryCode } from '@/app/(dashboard)/charities/[id]/audits/[audit]/page';
import { AuditStatus, DUMMY_AUDIT_VALUES } from '@/DUMMY_AUDIT_VALS';
import React, { FC } from 'react'

export type PreviewPageCommonProps = {
    country: CountryCode;
    status: AuditStatus
}

type IProps = PreviewPageCommonProps;


const PreviewCoreArea2: FC<IProps> = ({ country }) => {
    const auditVals = DUMMY_AUDIT_VALUES['core-area-2'];
    return (
        <div>PreviewCoreArea2</div>
    )
}

export default PreviewCoreArea2