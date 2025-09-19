'use client'
import { usePathname } from 'next/navigation';
import React from 'react'
import { PAGES } from '../sidebar/pages';
import { TypographyComponent } from '@/components/common/TypographyComponent';
import NotificationNavbar from '@/components/common/IconComponents/NotificationNavbar';

const AppbarComponent = () => {
    const pathname = usePathname();
    const paths = pathname.split('/');
    const firstPath = paths[1];
    const page = PAGES.find(eachPage => eachPage.name === firstPath)
    const pageTitle = page?.heading ?? '';
    return (
        <div className='border-b border-[rgb(178,178,178)/10] border-opacity-10 px-4 py-[14px] flex items-center mb-5'>
            <TypographyComponent variant='h1' className='w-full'>
                {pageTitle}
            </TypographyComponent>
            <div className="flex gap-2 items-center">
                <NotificationNavbar />
                <div className="rounded-full bg-gray-300 w-[35px] text-xs  h-[35px] text-gray-600 flex justify-center items-center">MG</div>
            </div>
        </div>
    )
}

export default AppbarComponent