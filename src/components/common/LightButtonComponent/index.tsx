import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import React, { FC } from 'react'

type IProps = {
    children: React.ReactNode,
    icon?: React.ReactNode,
    className?: string,
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void,
    loading?: boolean,
}

const LightButtonComponent: FC<IProps> = ({ children, icon, className, onClick, loading }) => {
    return (
        <Button
            onClick={(event) => {
                if (onClick) onClick(event)
            }}
            loading={loading}
            variant="outline"
            className={cn('bg-[#F7F7F7] border border-[#E6E6E6] text-primary', className)}
        >
            {icon ? <span className="inline-flex items-center">{icon}</span> : null}
            {children}
        </Button>
    )
}

export default LightButtonComponent
