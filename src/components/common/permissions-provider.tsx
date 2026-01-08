"use client";

import React, { createContext, useCallback, useContext, useMemo } from "react";
import type { PermissionId, PermissionRequirement } from "@/lib/permissions";
import { findRouteRequirement, isAllowed, toPermissionSet } from "@/lib/permissions";
import { ROUTE_REQUIREMENTS } from "@/lib/permissions-config";

type PermissionsContextValue = {
    isAdmin: boolean;
    permissions: PermissionId[];
    hasAny: (permissions?: PermissionId[]) => boolean;
    hasAll: (permissions?: PermissionId[]) => boolean;
    isAllowed: (requirement?: PermissionRequirement) => boolean;
    canAccessPath: (pathname: string) => boolean;
};

const PermissionsContext = createContext<PermissionsContextValue | null>(null);

type PermissionsProviderProps = {
    isAdmin: boolean;
    permissions: PermissionId[];
    children: React.ReactNode;
};

export const PermissionsProvider = ({ isAdmin, permissions, children }: PermissionsProviderProps) => {
    const permissionSet = useMemo(() => toPermissionSet(permissions), [permissions]);

    const hasAny = useCallback(
        (list: PermissionId[] = []) => (isAdmin ? true : list.length === 0 || list.some((p) => permissionSet.has(p))),
        [isAdmin, permissionSet],
    );

    const hasAll = useCallback(
        (list: PermissionId[] = []) => (isAdmin ? true : list.length === 0 || list.every((p) => permissionSet.has(p))),
        [isAdmin, permissionSet],
    );

    const isAllowedRequirement = useCallback(
        (requirement?: PermissionRequirement) => (isAdmin ? true : isAllowed(permissionSet, requirement)),
        [isAdmin, permissionSet],
    );

    const canAccessPath = useCallback(
        (pathname: string) => {
            if (isAdmin) return true;
            const requirement = findRouteRequirement(pathname, ROUTE_REQUIREMENTS);
            return isAllowed(permissionSet, requirement);
        },
        [isAdmin, permissionSet],
    );

    const value = useMemo(
        () => ({
            isAdmin,
            permissions,
            hasAny,
            hasAll,
            isAllowed: isAllowedRequirement,
            canAccessPath,
        }),
        [isAdmin, permissions, hasAny, hasAll, isAllowedRequirement, canAccessPath],
    );

    return <PermissionsContext.Provider value={value}>{children}</PermissionsContext.Provider>;
};

export const usePermissions = () => {
    const context = useContext(PermissionsContext);
    if (!context) {
        throw new Error("usePermissions must be used within a PermissionsProvider.");
    }
    return context;
};
