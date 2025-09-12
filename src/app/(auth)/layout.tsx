import { ImageComponent } from '@/components/common/ImageComponent';
import React from 'react'

export default function AuthScreensLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className='bg-background flex justify-center items-center min-h-screen'>
            {children}
        </main>
    );
}
