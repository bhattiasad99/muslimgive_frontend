import CardComponent from '@/components/common/CardComponent'
import React, { FC } from 'react'

type IProps = {
    action?: React.ReactNode,
    headingText: string,
    children: React.ReactNode
}

const UserCardLayout: FC<IProps> = ({ headingText, action, children }) => {
    return (
        <CardComponent withShadow={false} extraRounded>
            <div className="flex flex-col gap-2 w-full">
                <div className="font-semibold w-full flex items-center">
                    <span className="w-full">
                        {headingText}
                    </span>
                    {action ? action : null}
                </div>
                <div className="h-[1px] w-full bg-[rgba(0,0,0,0.1)]">&nbsp;</div>
                <div>
                    {children}
                </div>
            </div>
        </CardComponent>
    )
}

export default UserCardLayout