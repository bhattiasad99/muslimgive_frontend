import React from 'react'
import { ManageRoles } from '@/components/use-case/AccessControl'

const AccessControlPage = () => {
    return (
        <div className="p-4">
            <ManageRoles />
        </div>
    )
}

export default AccessControlPage