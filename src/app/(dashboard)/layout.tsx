import DashboardLayoutComponent from '@/components/use-case/dashboard-layout-component';
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
