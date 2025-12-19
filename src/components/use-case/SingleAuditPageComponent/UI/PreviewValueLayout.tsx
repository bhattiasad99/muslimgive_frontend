import { cn } from '@/lib/utils'
import React, { FC } from 'react'

type IProps = {
    orientation?: 'vertical' | 'horizontal',
    label: string;
    result: React.ReactNode | string
}

const PreviewValueLayout: FC<IProps> = ({ orientation = 'horizontal', label, result }) => {
    return (
        <div className={cn('p-4 border border-[#BBC9DE] rounded-xl gap-2 flex', orientation === 'vertical' ? 'flex-col' : 'flex-row')}>
            <div className="font-bold w-[250px]">{label}</div>
            <div>{result}</div>
        </div>
    )
}

export default PreviewValueLayout