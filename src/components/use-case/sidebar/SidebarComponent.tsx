import { ImageComponent } from "@/components/common/ImageComponent";
import { Item, SidebarGroupComponent } from "./SidebarGroupComponent";
import { PAGES, PageType } from "./pages";
import { Sidebar, SidebarContent, SidebarProvider } from "@/components/ui/sidebar";
import SignOutBtnInSidebar from "../sign-out-button-sidebar/SignOutBtnInSidebar";
import { getCookies } from "@/app/lib/cookies";
import { jwtDecode } from "jwt-decode";
import { redirect } from "next/navigation";
import { signOut } from "@/app/actions/auth";

type MenuItemType = {
    title: string,
    items: Item[]
}


const SideBarComponent = async () => {
    const { accessToken } = await getCookies();
    if (!accessToken) {
        await signOut()
        redirect('/login')
    }
    const decoded: any = jwtDecode(accessToken); // decode only, no verify here
    const isAdmin = decoded?.isAdmin ?? false;
    const buildPages = (name: PageType) => PAGES.filter(eachPage => eachPage.show).filter(eachPage => eachPage.type === name).map(page => ({
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
            title: "Menu",
            items: buildPages("menu"),
        },
        // only push Admin menu if admin
        ...(isAdmin
            ? [
                {
                    title: "Admin",
                    items: buildPages("admin"),
                },
            ]
            : []),
    ];

    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarContent>
                    <div className="pt-5 px-3" >
                        <ImageComponent source="/logo__white.png" alt="MuslimGive Logo" height={30} width={120} />
                    </div>
                    <div className="flex flex-col gap-2 grow">
                        {menu.map(eachMenuItem => {
                            return <SidebarGroupComponent key={eachMenuItem.title} label={eachMenuItem.title} options={eachMenuItem.items} />
                        })}
                    </div>
                    <SignOutBtnInSidebar />
                </SidebarContent>
            </Sidebar >
        </SidebarProvider>
    )
}

export default SideBarComponent;