'use client'
import React, { FC } from 'react'

type IProps = {
    children: React.ReactNode
}

const KanbanEffect: FC<IProps> = ({ children }) => {
    return (
        <div
            className="overflow-x-auto scrollbar-sleek"
        >
            <div className="flex gap-5 min-w-max md:min-w-0">
                {children}
            </div>
        </div>
    )
}

export default KanbanEffect
