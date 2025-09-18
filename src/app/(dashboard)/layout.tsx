import { ImageComponent } from '@/components/common/ImageComponent';
import DashboardLayoutComponent from '@/components/use-case/dashboard-layout-component';
import SideBarComponent from '@/components/use-case/sidebar/SidebarComponent';
import React from 'react'

export default function DashboardScreensLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <DashboardLayoutComponent >
            {children}
        </DashboardLayoutComponent>
    );
}
