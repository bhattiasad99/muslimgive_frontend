import React from 'react'

const DashboardSkeleton = () => {
    return (
        <div className="p-4 space-y-4">
            <div className="h-8 w-1/3 rounded-xl bg-muted animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-40 rounded-2xl bg-muted animate-pulse" />
                <div className="h-40 rounded-2xl bg-muted animate-pulse" />
            </div>
            <div className="h-72 rounded-2xl bg-muted animate-pulse" />
        </div>
    )
}

export default DashboardSkeleton