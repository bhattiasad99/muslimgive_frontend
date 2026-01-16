import { kanit } from '@/app/fonts';
import { AuditStatus, GradeType } from '@/DUMMY_AUDIT_VALS';
import { capitalizeWords } from '@/lib/helpers';
import { cn } from '@/lib/utils'
import React, { FC } from 'react'

type IProps = {
    title: string,
    subTitle: string,
    grade?: GradeType,
    result?: 'pass' | 'fail' | null,
    score: number,
    status: AuditStatus
    isOpen: boolean,
    setOpenId: (val: string | null) => void;
    close: () => void;
}

const AccordionHeader: FC<IProps> = ({ title, subTitle, grade, result, score, status }) => {
    const statusClassName: Record<AuditStatus, string> = {
        'submitted': 'bg-[#5CF269] border-[#57de62]',
        'draft': 'bg-[#F2C94C] border-[#e5c24b]',
        'pending': 'bg-[#F2994A] border-[#e68f48]',
        'in-progress': 'bg-[#3B82F6] border-[#2563eb]'
    }
    return (
        <div className="flex w-full flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p className={cn("w-fit text-gray-600 bg-gray-100 border border-gray-300 text-xs p-0.5 rounded-lg flex justify-center font-normal px-2", kanit.className)}>
                {capitalizeWords(title)}
            </p>
            <p className="md:min-w-[150px]">
                {capitalizeWords(subTitle)}
            </p>
            <p className="md:min-w-[150px]">{status === 'pending' ? '-' : (result ? capitalizeWords(result) : (grade || '-'))}</p>
            <p className="md:min-w-[150px]">{status === 'pending' ? '-' : score}</p>
            <div className="md:w-[100px] flex justify-center items-center">
                <p
                    className={cn(
                        'px-3 py-0.5 text-xs rounded-lg flex justify-center border',
                        statusClassName[status]
                    )}
                >
                    {capitalizeWords(status)}
                </p>
            </div>
        </div>
    )
}

export default AccordionHeader
