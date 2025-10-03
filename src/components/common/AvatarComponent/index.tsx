import React, { FC } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from 'lucide-react'

type IProps = {
    fallback: string,
    source?: string,
    sizePx?: number
}

const AvatarComponent: FC<IProps> = ({ fallback, source = null, sizePx = 148 }) => {
    const dim = {
        width: `${sizePx}px`,
        height: `${sizePx}px`,
    }
    return (
        <Avatar style={dim} className='border border-gray-300'>
            {source ? <><AvatarImage src={source ?? ''} />
                <AvatarFallback>{fallback}</AvatarFallback></> : <AvatarFallback>
                <User style={dim} color='#e9e9e9' />
            </AvatarFallback>}

        </Avatar>
    )
}

export default AvatarComponent