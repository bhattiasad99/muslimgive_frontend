import React from 'react'
import SideBarComponent from '../sidebar/SidebarComponent'
import AppbarComponent from '../appbar/AppbarComponent'
import SidebarShell from '@/components/common/SidebarShell'
import { listCharitiesAction } from '@/app/actions/charities'

type IProps = {
    children: React.ReactNode
    permissions: string[]
    isAdmin: boolean
}

const unwrap = <K,>(res: { ok: boolean; payload?: { data?: K | { data?: K } } | null }): K | null => {
    if (!res.ok) return null
    const data = res.payload?.data as any
    if (data && typeof data === "object" && "data" in data) return data.data ?? null
    return (data as K) ?? null
}

const DashboardLayoutComponent = async ({ children, permissions, isAdmin }: IProps) => {
    // Use cached version for pending count - revalidates every 30 seconds
    const pendingRes = await listCharitiesAction({
        status: ['pending-eligibility'],
        pendingEligibilitySource: 'deep-scan',
        page: 1,
        limit: 1,
    }, true)
    const pendingPayload = unwrap<{ meta?: { total?: number } }>(pendingRes)
    const pendingCount = pendingPayload?.meta?.total ?? 0

    return (
        <SidebarShell>
            <main className='bg-white min-h-screen flex flex-col md:flex-row w-full'>
                <div className="w-0 h-0 overflow-hidden md:w-64 md:h-auto md:overflow-visible md:shrink-0">
                    <SideBarComponent permissions={permissions} isAdmin={isAdmin} />
                </div>
                <div className="flex min-w-0 flex-col gap-2 w-full md:w-[calc(100%-16rem)]">
                    <AppbarComponent initialDeepScanCount={pendingCount} />
                    <div className="px-4 pb-4 sm:pb-6">
                        {children}
                    </div>
                </div>
            </main>
        </SidebarShell>
    )
}

export default DashboardLayoutComponent
