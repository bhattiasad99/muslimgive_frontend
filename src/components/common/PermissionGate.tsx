"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { usePermissions } from "@/components/common/permissions-provider";
import NotAuthorized from "@/components/common/NotAuthorized";

const PermissionGate = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const { canAccessPath } = usePermissions();

    if (!pathname) return <>{children}</>;
    if (!canAccessPath(pathname)) return <NotAuthorized />;
    return <>{children}</>;
};

export default PermissionGate;
