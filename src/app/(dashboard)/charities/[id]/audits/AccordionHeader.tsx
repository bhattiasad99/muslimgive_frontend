import { kanit } from '@/app/fonts';
import ThreeDotIcon from '@/components/common/IconComponents/ThreeDotIcon';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent } from '@/components/ui/popover'
import { AuditStatus, GradeType } from '@/DUMMY_AUDIT_VALS';
import { capitalizeWords } from '@/lib/helpers';
import { cn } from '@/lib/utils'
import { PopoverTrigger } from '@radix-ui/react-popover';
import React, { FC } from 'react'

type IProps = {
    title: string,
    subTitle: string,
    grade: GradeType,
    score: number,
    status: AuditStatus
    isOpen: boolean,
    setOpenId: (val: string | null) => void;
    close: () => void;
}

const AccordionHeader: FC<IProps> = ({ title, subTitle, grade, score, status, isOpen, setOpenId }) => {
    const statusClassName: Record<AuditStatus, string> = {
        'submitted': 'bg-[#5CF269] border-[#57de62]',
        'draft': 'bg-[#F2C94C] border-[#e5c24b]',
        'pending': 'bg-[#F2994A] border-[#e68f48]',
        'in-progress': 'bg-[#3B82F6] border-[#2563eb]'
    }
    return (
        <div className="flex w-full items-center justify-between">
            <p className={cn("min-w-[50px] text-gray-600 bg-gray-100 border border-gray-300 text-xs p-0.5 rounded-lg flex justify-center font-normal px-2", kanit.className)}>
                {capitalizeWords(title)}
            </p>
            <p className="min-w-[150px]">
                {capitalizeWords(subTitle)}
            </p>
            <p className="min-w-[150px]">{grade}</p>
            <p className="min-w-[150px]">{score}</p>
            <div className="w-[100px] flex justify-center items-center">
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