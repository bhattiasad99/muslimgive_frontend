'use client'
import LinkComponent from "@/components/common/LinkComponent";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
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
    const pathname = usePathname();
    const paths = pathname.split('/');
    const firstPath = paths[1];
    return <SidebarGroup>
        <SidebarGroupLabel>{label}</SidebarGroupLabel>
        <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-3">
                {options.map((item) => {
                    const isActive = item.name === firstPath;
                    if (item.action.type === 'button') {
                        return (
                            <SidebarMenuItem key={item.name}>
                                <SidebarMenuButton className={cn("flex gap-3", isActive ? "font-bold text-primary" : "")} variant={"default"} onClick={() => {
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
                                <SidebarMenuButton variant={"default"} asChild>
                                    <LinkComponent className={cn("flex gap-3", isActive ? "font-bold text-primary" : "")} to={item.action.target}>
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

