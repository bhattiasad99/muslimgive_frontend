import LinkComponent from "@/components/common/LinkComponent";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import type { FC } from "react";

// Menu items.
type Action =
    | {
        type: "url";
        target: string;
        clickHandlers?: never; // ❌ explicitly disallowed
    }
    | {
        type: "button";
        clickHandler: () => void;
        targets?: never;       // ❌ explicitly disallowed
    };


export type Item = {
    title: string,
    action: Action,
    icon: React.ReactNode,
    name: string
}


type SidebarGroupProps = {
    label: string,
    options: Item[]
}

export const SidebarGroupComponent: FC<SidebarGroupProps> = ({ label, options }) => {
    return <SidebarGroup>
        <SidebarGroupLabel>{label}</SidebarGroupLabel>
        <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-3">
                {options.map((item) => {
                    if (item.action.type === 'button') {
                        return (
                            <SidebarMenuItem key={item.name}>
                                <SidebarMenuButton className="flex gap-3" variant={"outline"} onClick={() => {
                                    if (item.action.type === 'button')
                                        item.action.clickHandler()
                                }} >
                                    <span>{item.icon}</span>
                                    <span>{item.title}</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    }
                    if (item.action.type === 'url') {
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton variant={"outline"} asChild>
                                    <LinkComponent className="flex gap-3" to={item.action.target}>
                                        <span>{item.icon}</span>
                                        <span>{item.title}</span>
                                    </LinkComponent>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    }
                })}
            </SidebarMenu>
        </SidebarGroupContent>
    </SidebarGroup>
}

