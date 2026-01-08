"use client";

import React from "react";
import type { PermissionRequirement } from "@/lib/permissions";
import { usePermissions } from "@/components/common/permissions-provider";

type CanProps = PermissionRequirement & {
    children: React.ReactNode;
    fallback?: React.ReactNode;
};

const Can = ({ anyOf, allOf, children, fallback = null }: CanProps) => {
    const { isAllowed } = usePermissions();
    const allowed = isAllowed({ anyOf, allOf });
    if (!allowed) return <>{fallback}</>;
    return <>{children}</>;
};

export default Can;
