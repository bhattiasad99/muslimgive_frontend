import { Card } from '@/components/ui/card'
import React, { FC, ReactNode } from 'react'

type IProps = {
    children: ReactNode
}

const AuditSectionCard: FC<IProps> = ({ children }) => {
    return (
        <Card className='shadow-sm shadow-gray-300'>{children}</Card>
    )
}

export default AuditSectionCard