"use client";

import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";

const SidebarShell = ({ children }: { children: React.ReactNode }) => {
    return <SidebarProvider>{children}</SidebarProvider>;
};

export default SidebarShell;
