import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import React, { FC } from 'react'

type IProps = {
    children: React.ReactNode,
    icon?: React.ReactNode,
    className?: string,
    onClick?: () => void,
}

const LightButtonComponent: FC<IProps> = ({ children, icon, className, onClick }) => {
    return (
        <Button onClick={() => {
            if (onClick) onClick()
        }} variant="outline" className={cn('bg-[#F7F7F7] border border-[#E6E6E6] text-primary', className)}>{icon ? <span>{icon}</span> : null} {children}</Button>
    )
}

export default LightButtonComponent