import React, { FC, useRef } from 'react'

type IProps = {
    children: React.ReactNode
}

const KanbanEffect: FC<IProps> = ({ children }) => {
    const containerRef = useRef<HTMLDivElement>(null)
    let isDown = false
    let startX: number
    let scrollLeft: number

    const handleMouseDown = (e: React.MouseEvent) => {
        isDown = true
        startX = e.pageX - (containerRef.current?.offsetLeft || 0)
        scrollLeft = containerRef.current?.scrollLeft || 0
    }

    const handleMouseLeave = () => {
        isDown = false
    }

    const handleMouseUp = () => {
        isDown = false
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDown) return
        e.preventDefault()
        const x = e.pageX - (containerRef.current?.offsetLeft || 0)
        const walk = (x - startX) * 1 // multiplier for speed
        if (containerRef.current) {
            containerRef.current.scrollLeft = scrollLeft - walk
        }
    }

    return (
        <div
            ref={containerRef}
            className="overflow-x-hidden scrollbar-hide cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
        >
            <div className="flex gap-5">
                {children}
            </div>
        </div>
    )
}

export default KanbanEffect
