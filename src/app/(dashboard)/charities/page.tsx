import CharitiesPageComponent from '@/components/use-case/CharitiesPageComponent'
import React from 'react'
import { listUsersAction } from '@/app/actions/users'

const Charities = async () => {
    const usersRes = await listUsersAction({ limit: 200 })
    const allUsers = Array.isArray(usersRes?.payload?.data) ? usersRes.payload.data : []

    const toRoleSlug = (value: string) => value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    const roleAliases = ['project-manager']

    const projectManagers = allUsers
        .filter((u: any) => {
            const roles: string[] = Array.isArray(u?.roles) ? u.roles : []
            return roles.some(r => roleAliases.includes(toRoleSlug(String(r))))
        })
        .map((u: any) => ({
            id: u.id,
            name: `${u.firstName} ${u.lastName}`.trim() || u.name || "Unnamed User",
            email: u.email ?? null,
        }))

    return (
        <CharitiesPageComponent projectManagers={projectManagers} />
    )
}

export default Charities