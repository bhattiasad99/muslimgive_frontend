import { CountryCode } from '@/app/(dashboard)/charities/[id]/audits/[audit]/page';
import { AuditStatus } from '@/DUMMY_AUDIT_VALS';
import React, { FC } from 'react'
export type PreviewPageCommonProps = {
    country: CountryCode;
    status: AuditStatus
}

type IProps = PreviewPageCommonProps;

const PreviewCoreArea4: FC<IProps> = () => {
    return (
        <div>PreviewCoreArea4</div>
    )
}

export default PreviewCoreArea4