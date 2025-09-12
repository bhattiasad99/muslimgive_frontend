import { ImageComponent } from '@/components/common/ImageComponent';
import SideBarComponent from '@/components/use-case/sidebar/SidebarComponent';
import React from 'react'

export default function DashboardScreensLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className='bg-white min-h-screen flex'>
            <SideBarComponent />
            <div className="">
                {children}
            </div>
        </main>
    );
}
