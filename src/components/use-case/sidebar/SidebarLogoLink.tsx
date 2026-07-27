'use client'

import LinkComponent from '@/components/common/LinkComponent'
import { ImageComponent } from '@/components/common/ImageComponent'
import { useSidebarNavigation } from '@/hooks/use-sidebar-navigation'

const LOGO_SRC = '/zakat-advisory-logos/logo-transparent.png'

const SidebarLogoLink = () => {
    const { navigate } = useSidebarNavigation()

    return (
        <LinkComponent
            to="/charities"
            className="group/logo flex h-9 items-center overflow-hidden"
            onClick={(event) => {
                event.preventDefault()
                navigate('/charities', 'Charities')
            }}
        >
            <ImageComponent
                source={LOGO_SRC}
                alt="Zakah Advisor Logo"
                height={36}
                width={114}
                priority
                className="h-8 w-auto max-w-[140px] object-contain object-left"
            />
        </LinkComponent>
    )
}

export default SidebarLogoLink
