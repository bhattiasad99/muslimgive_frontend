import React, { FC } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type IProps = {
    fallback: string,
    source?: string
}

const AvatarComponent: FC<IProps> = ({ fallback, source = null }) => {
    return (
        <Avatar className='w-37 h-37 border border-gray-300'>
            <AvatarImage src={source ?? ''} />
            <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
    )
}

export default AvatarComponent