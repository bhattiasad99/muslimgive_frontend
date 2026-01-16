'use client'
import { usePathname, useRouter } from 'next/navigation';
import React, { useMemo } from 'react';
import { PAGES } from '../sidebar/pages';
import { TypographyComponent } from '@/components/common/TypographyComponent';
import NotificationNavbar from '@/components/common/IconComponents/NotificationNavbar';
import { AUDIT_DEFINITIONS, isAuditSlug } from '@/components/use-case/SingleAuditPageComponent/AUDIT_DEFINITIONS';
import { SidebarTrigger } from '@/components/ui/sidebar';

type TitleResolver = {
    match: (segments: string[]) => boolean;
    getTitle: (segments: string[]) => string | undefined;
};

const TITLE_RESOLVERS: TitleResolver[] = [
    {
        match: (segments) => segments[0] === 'charities' && segments[2] === 'audits' && Boolean(segments[3]),
        getTitle: (segments) => {
            const auditSlug = segments[3];
            if (auditSlug && isAuditSlug(auditSlug)) {
                return AUDIT_DEFINITIONS[auditSlug].title;
            }
            return undefined;
        },
    },
    {
        match: (segments) => segments[0] === 'charities' && segments[2] === 'audits' && !segments[3],
        getTitle: () => 'Audit History',
    },
    {
        match: () => true,
        getTitle: (segments) => {
            const page = PAGES.find(eachPage => eachPage.name === segments[0]);
            return page?.heading;
        },
    },
];

const getAppbarTitle = (pathname: string) => {
    const segments = pathname.split('/').filter(Boolean);
    for (const resolver of TITLE_RESOLVERS) {
        if (resolver.match(segments)) {
            const title = resolver.getTitle(segments);
            if (title) {
                return title;
            }
        }
    }
    return '';
};

const AppbarComponent = () => {
    const pathname = usePathname();
    const router = useRouter();
    const pageTitle = useMemo(() => getAppbarTitle(pathname), [pathname]);
    
    const handleProfileClick = () => {
        router.push('/profile');
    };
    
    return (
        <div className='border-b border-[rgb(178,178,178)/10] border-opacity-10 px-4 py-[14px] flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5'>
            <div className="flex items-center gap-3 w-full">
                <div className="md:hidden">
                    <SidebarTrigger />
                </div>
                <TypographyComponent variant='h1' className='w-full'>
                    {pageTitle}
                </TypographyComponent>
            </div>
            <div className="flex gap-2 items-center">
                {/* <NotificationNavbar /> */}
                <div 
                    className="rounded-full bg-gray-300 w-[35px] text-xs h-[35px] text-gray-600 flex justify-center items-center cursor-pointer hover:bg-gray-400 transition-colors"
                    onClick={handleProfileClick}
                >
                    MG
                </div>
            </div>
        </div>
    )
}

export default AppbarComponent
