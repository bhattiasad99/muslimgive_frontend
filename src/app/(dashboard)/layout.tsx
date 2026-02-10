import DashboardLayoutComponent from '@/components/use-case/dashboard-layout-component';
import PermissionGate from '@/components/common/PermissionGate';
import { PermissionsProvider } from '@/components/common/permissions-provider';
import { getMeAction } from '@/app/actions/users';
import { listPermissionsAction } from '@/app/actions/roles';
import { resolvePermissions } from '@/lib/permissions';
import React from 'react'

export default async function DashboardScreensLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // Use cached variants to avoid repeated API calls on every navigation
    const meRes = await getMeAction(true);
    const permsRes = await listPermissionsAction(true);

    const me = meRes.ok ? meRes.payload?.data : null;
    const isAdmin = Boolean(me?.isAdmin);
    const userPermissions = Array.isArray(me?.permissions) ? me.permissions : [];

    const catalogRaw = permsRes.ok ? permsRes.payload?.data : null;
    const catalog = Array.isArray(catalogRaw)
        ? catalogRaw
        : Array.isArray(catalogRaw?.data)
            ? catalogRaw.data
            : [];

    const resolvedPermissions = resolvePermissions(userPermissions, catalog);

    return (
        <PermissionsProvider isAdmin={isAdmin} permissions={resolvedPermissions}>
            <DashboardLayoutComponent permissions={resolvedPermissions} isAdmin={isAdmin}>
                <PermissionGate>
                    {children}
                </PermissionGate>
            </DashboardLayoutComponent>
        </PermissionsProvider >
    );
}
