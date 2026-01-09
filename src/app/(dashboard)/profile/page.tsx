'use client'
import React, { useState } from 'react'
import UserData from '@/components/use-case/UsersExpandableTable/UserData'
import UpdatePasswordModal from '@/components/use-case/ProfilePageComponent/UpdatePasswordModal'
import EditPersonalInfoModal from '@/components/use-case/ProfilePageComponent/EditPersonalInfoModal'
import EditAddressModal from '@/components/use-case/ProfilePageComponent/EditAddressModal'
import type { Data, Role } from '@/components/use-case/UsersExpandableTable'
import { getMeAction } from '@/app/actions/users'
import { toast } from 'sonner'
import DashboardSkeleton from '@/components/use-case/DashboardSkeleton'
import { kebabToTitle } from '@/lib/helpers'

const MyProfile = () => {
    // State for modals
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
    const [isPersonalInfoModalOpen, setIsPersonalInfoModalOpen] = useState(false)
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)

    // User data state
    const [profile, setProfile] = useState<Data | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    React.useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true)
            try {
                const res = await getMeAction()
                if (res.ok && res.payload?.data) {
                    const u = res.payload.data;
                    setProfile({
                        id: u.id,
                        firstName: u.firstName,
                        lastName: u.lastName,
                        email: u.email,
                        dateOfBirth: u.dob || '',
                        phoneNumber: u.phone || '',
                        location: u.city && u.country ? `${u.city}, ${u.country}` : (u.city || u.country || '-'),
                        postalCode: u.postalCode || '',
                        roles: (u.roles || []).map(r => kebabToTitle(r) as Role),
                        status: (u.isActive ? 'Active' : 'Inactive') as any,
                        requestingPasswordReset: u.requestingPasswordReset
                    })
                } else {
                    toast.error(res.message || "Failed to load profile")
                }
            } catch (error) {
                console.error(error)
                toast.error("An error occurred while loading profile")
            } finally {
                setIsLoading(false)
            }
        }
        fetchProfile()
    }, [])

    if (isLoading) return <DashboardSkeleton />
    if (!profile) return <div className="p-6">Profile not found.</div>

    return (
        <div className="flex flex-col h-full">
            <UserData
                {...profile}
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
                initialData={{
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth) : undefined,
                    phoneNumber: profile.phoneNumber
                }}
                onSave={(data) => {
                    setProfile(prev => prev ? {
                        ...prev,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        dateOfBirth: data.dateOfBirth ? data.dateOfBirth.toISOString().split('T')[0] : '',
                        phoneNumber: data.phoneNumber
                    } : null)
                }}
            />

            <EditAddressModal
                open={isAddressModalOpen}
                onOpenChange={setIsAddressModalOpen}
                initialData={{
                    country: profile.location.split(', ')[1] || '',
                    city: profile.location.split(', ')[0] || '',
                    postalCode: profile.postalCode
                }}
                onSave={(data) => {
                    setProfile(prev => prev ? {
                        ...prev,
                        location: `${data.city}, ${data.country}`,
                        postalCode: data.postalCode
                    } : null)
                }}
            />
        </div>
    )
}

export default MyProfile