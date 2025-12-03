import React, { FC } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from 'lucide-react'
import { cn } from '@/lib/utils'

type IProps = {
    fallback: string,
    source?: string,
    sizePx?: number,
    className?: string,
}

const AvatarComponent: FC<IProps> = ({ fallback, source = null, sizePx = 148, className = '' }) => {
    const dim = {
        width: `${sizePx}px`,
        height: `${sizePx}px`,
    }
    return (
        <Avatar style={dim} className={cn("rounded-full bg-gray-100", className)}>
            {source ? <><AvatarImage src={source ?? ''} />
                <AvatarFallback>{fallback}</AvatarFallback></> : <AvatarFallback>
                <User style={dim} color='#e9e9e9' />
            </AvatarFallback>}

        </Avatar>
    )
}

export default AvatarComponent