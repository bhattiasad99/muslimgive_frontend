import Charities from "../../common/IconComponents/pages_icons/Charities"
import Profile from "../../common/IconComponents/pages_icons/Profile"
import AccessControl from "../../common/IconComponents/pages_icons/AccessControl"

export type PageType = 'menu' | 'admin'

export type Page = {
    path: string,
    heading: string,
    icon: React.ReactNode,
    name: string,
    type: PageType,
    show: boolean
}

export const selectPageByName = (name: string): Page | undefined => {
    return PAGES.find((page) => page.name === name);
}

export const PAGES: Page[] = [
    {
        name: 'charities',
        path: "/charities",
        heading: 'Charities',
        icon: <Charities />,
        type: 'menu',
        show: true
    },
    {
        name: 'charities',
        path: "/charities",
        heading: 'Charities',
        icon: <Charities />,
        type: 'menu',
        show: true
    },
    {
        name: 'profile',
        path: "/profile",
        heading: 'My Profile',
        icon: <Profile />,
        type: 'menu',
        show: true
    },
    {
        name: 'users',
        path: "/users",
        heading: 'Users',
        icon: <Profile />,
        type: 'admin',
        show: true
    },
    {
        name: 'access-control',
        path: "/access-control",
        heading: 'Access Control',
        icon: <AccessControl />,
        type: 'admin',
        show: true
    },
]