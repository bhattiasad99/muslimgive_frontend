'use client'
import React, { useState } from 'react'
import UserData from '@/components/use-case/UsersExpandableTable/UserData'
import UpdatePasswordModal from '@/components/use-case/ProfilePageComponent/UpdatePasswordModal'
import EditPersonalInfoModal from '@/components/use-case/ProfilePageComponent/EditPersonalInfoModal'
import EditAddressModal from '@/components/use-case/ProfilePageComponent/EditAddressModal'
import type { Data, Role } from '@/components/use-case/UsersExpandableTable'

const MyProfile = () => {
    // State for modals
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
    const [isPersonalInfoModalOpen, setIsPersonalInfoModalOpen] = useState(false)
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)

    // User data state
    const [personalInfo, setPersonalInfo] = useState({
        firstName: 'Asad',
        lastName: 'Bhatti',
        dateOfBirth: new Date('1993-05-06') as Date | undefined,
        phoneNumber: '+923348506479'
    })

    const [addressInfo, setAddressInfo] = useState({
        country: 'Canada',
        city: 'Toronto',
        postalCode: 'M5A 1A1'
    })

    const userId = '2fcfbdfc-ffa3-4c37-96f5-0ad2b23c32b7'
    const userEmail = 'bhatti.asad99@gmail.com'
    const assignedRoles: Role[] = ['Financial Auditor', 'Project Manager']

    const userData: Data = {
        id: userId,
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        email: userEmail,
        dateOfBirth: personalInfo.dateOfBirth ? personalInfo.dateOfBirth.toISOString().split('T')[0] : '',
        phoneNumber: personalInfo.phoneNumber,
        location: `${addressInfo.city}, ${addressInfo.country}`,
        postalCode: addressInfo.postalCode,
        roles: assignedRoles,
        status: 'Active',
        requestingPasswordReset: false
    }

    return (
        <div className="flex flex-col h-full">
            <UserData 
                {...userData}
                onEditPersonalInfo={() => setIsPersonalInfoModalOpen(true)}
                onEditAddress={() => setIsAddressModalOpen(true)}
                onChangePassword={() => setIsPasswordModalOpen(true)}
                showEditButtons={true}
            />

            {/* Modals */}
            <UpdatePasswordModal 
                open={isPasswordModalOpen}
                onOpenChange={setIsPasswordModalOpen}
            />
            
            <EditPersonalInfoModal
                open={isPersonalInfoModalOpen}
                onOpenChange={setIsPersonalInfoModalOpen}
                initialData={personalInfo}
                onSave={setPersonalInfo}
            />
            
            <EditAddressModal
                open={isAddressModalOpen}
                onOpenChange={setIsAddressModalOpen}
                initialData={addressInfo}
                onSave={setAddressInfo}
            />
        </div>
    )
}

export default MyProfile