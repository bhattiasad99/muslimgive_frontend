import { getUsers } from '@/app/actions/admin'
import UsersPageComponent from '@/components/use-case/UsersPageComponent'
import React from 'react'

const UsersPage = async () => {
    const usersRes = await getUsers()
    const { ok, payload, message } = usersRes;
    if (!ok) {
        return <div>{message}</div>
    }
    const users = payload?.data || []
    return (
        <UsersPageComponent usersArr={users} />
    )
}

export default UsersPage