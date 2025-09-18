import React, { FC } from 'react'
import SideBarComponent from '../sidebar/SidebarComponent'
import AppbarComponent from '../appbar/AppbarComponent'

type IProps = {
    children: React.ReactNode
}

const DashboardLayoutComponent: FC<IProps> = ({ children }) => {
    return (
        <main className='bg-white min-h-screen flex'>
            <SideBarComponent />
            <div className="flex flex-col gap-2 w-full">
                <AppbarComponent />
                <div className="px-4">
                    {children}
                </div>
            </div>
        </main>
    )
}

export default DashboardLayoutComponent