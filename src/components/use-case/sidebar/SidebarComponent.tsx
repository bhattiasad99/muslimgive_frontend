import { ImageComponent } from "@/components/common/ImageComponent";
import { Item, SidebarGroupComponent } from "./SidebarGroupComponent";
import { PAGES, PageType } from "./pages";
import { Sidebar, SidebarContent, SidebarProvider } from "@/components/ui/sidebar";

type MenuItemType = {
    title: string,
    items: Item[]
}

const SideBarComponent = () => {
    const buildPages = (name: PageType) => PAGES.filter(eachPage => eachPage.type === name).map(page => ({
        name: page.name,
        title: page.heading,
        action: {
            type: "url" as const,
            target: page.path
        },
        icon: page.icon
    }));
    const menu: MenuItemType[] = [
        {
            title: 'Menu',
            items: buildPages('menu')
        },
        {
            title: 'Admin',
            items: buildPages('admin')
        },

    ]
    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarContent>
                    <div className="pt-5 px-3" >
                        <ImageComponent source="/logo__white.png" alt="MuslimGive Logo" height={30} width={120} />
                    </div>
                    {menu.map(eachMenuItem => {
                        return <SidebarGroupComponent key={eachMenuItem.title} label={eachMenuItem.title} options={eachMenuItem.items} />
                    })}
                </SidebarContent>
            </Sidebar >
        </SidebarProvider>
    )
}

export default SideBarComponent

