import { getUsers } from '@/app/actions/admin'
import UsersPageComponent from '@/components/use-case/UsersPageComponent'
import React from 'react'

const UsersPage = async () => {
    try {
        const usersRes = await getUsers()
        const { ok, payload, message } = usersRes;
        if (!ok) {
            return (
                <div className="p-8">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h2 className="text-red-800 font-semibold mb-2">Error Loading Users</h2>
                        <p className="text-red-600">{message || 'Failed to load users'}</p>
                    </div>
                </div>
            )
        }
        const users = payload?.data || []
        return (
            <UsersPageComponent usersArr={users} />
        )
    } catch (error) {
        return (
            <div className="p-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h2 className="text-red-800 font-semibold mb-2">Connection Error</h2>
                    <p className="text-red-600">
                        Failed to connect to the server. Please check:
                    </p>
                    <ul className="list-disc list-inside mt-2 text-red-600 text-sm">
                        <li>Is the backend server running?</li>
                        <li>Is the SERVER environment variable set correctly?</li>
                        <li>Check your .env.local file</li>
                    </ul>
                    <p className="mt-3 text-xs text-red-500 font-mono">
                        {error instanceof Error ? error.message : 'Unknown error'}
                    </p>
                </div>
            </div>
        )
    }
}

export default UsersPage