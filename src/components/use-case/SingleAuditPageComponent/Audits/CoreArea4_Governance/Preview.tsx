import { CountryCode } from '@/app/(dashboard)/charities/[id]/audits/[audit]/page';
import { DUMMY_AUDIT_VALUES } from '@/DUMMY_AUDIT_VALS';
import React, { FC } from 'react'
export type PreviewPageCommonProps = {
    country: CountryCode;
}

type IProps = PreviewPageCommonProps;

const PreviewCoreArea4: FC<IProps> = ({ country }) => {
    const auditVals = DUMMY_AUDIT_VALUES['core-area-4'];
    return (
        <div>PreviewCoreArea4</div>
    )
}

export default PreviewCoreArea4