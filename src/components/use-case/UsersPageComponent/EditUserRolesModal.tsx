'use client'

import React, { FC, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import ModelComponentWithExternalControl from '@/components/common/ModelComponent/ModelComponentWithExternalControl'
import MultiSelectComboboxComponent from '@/components/common/MultiSelectComboboxComponent'
import { getUserRolesAction, updateUserRolesAction } from '@/app/actions/users'
import { listRolesAction } from '@/app/actions/roles'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

type IProps = {
    userId: string
    userName: string
    open: boolean
    onOpenChange: (open: boolean) => void
}

const EditUserRolesModal: FC<IProps> = ({ userId, userName, open, onOpenChange }) => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [selectedRoles, setSelectedRoles] = useState<string[]>([])
    const [initialRoles, setInitialRoles] = useState<string[]>([])

    const [availableRoles, setAvailableRoles] = useState<{ value: string, label: string }[]>([])

    // Fetch available roles
    useEffect(() => {
        const fetchAllRoles = async () => {
            const res = await listRolesAction()
            if (res.ok && res.payload?.data?.data) {
                const rolesData: any[] = Array.isArray(res.payload.data.data) ? res.payload.data.data : []
                setAvailableRoles(
                    rolesData.map((r: any) => ({
                        value: r.slug ?? r.id,
                        label: r.title,
                    }))
                )
            }
        }
        fetchAllRoles()
    }, [])

    useEffect(() => {
        if (open && userId) {
            const fetchRoles = async () => {
                setLoading(true)
                try {
                    const res = await getUserRolesAction(userId)
                    if (res.ok && res.payload?.data) {
                        const data: any = res.payload.data
                        // Correctly handle the response format: { data: { roles: [...] } }
                        const userRoles = Array.isArray(data.roles) ? data.roles : []

                        // If userRoles contains objects, map to slug. If strings, use as is.
                        const normalized = userRoles.map((r: any) =>
                            (typeof r === 'string' ? r : (r.slug || r.name || r.id || r.roleId))
                        )

                        setInitialRoles(normalized)
                        setSelectedRoles(normalized)
                    } else {
                        toast.error(res.message || "Failed to fetch user roles")
                    }
                } catch (error) {
                    console.error("Failed to fetch roles", error)
                    toast.error("An unexpected error occurred")
                } finally {
                    setLoading(false)
                }
            }
            fetchRoles()
        }
    }, [open, userId])

    const handleSave = async () => {
        setSaving(true)
        try {
            // content of 'add' is in selected but not in initial
            const toAdd = selectedRoles.filter(r => !initialRoles.includes(r))
            // content of 'remove' is in initial but not in selected
            const toRemove = initialRoles.filter(r => !selectedRoles.includes(r))

            if (toAdd.length === 0 && toRemove.length === 0) {
                toast.info("No changes to save")
                onOpenChange(false)
                return
            }

            const res = await updateUserRolesAction(userId, {
                add: toAdd,
                remove: toRemove
            })

            if (res.ok) {
                toast.success("Roles updated successfully")
                router.refresh()
                onOpenChange(false)
            } else {
                toast.error(res.message || "Failed to update roles")
            }
        } catch (error) {
            console.error("Failed to update roles", error)
            toast.error("An unexpected error occurred")
        } finally {
            setSaving(false)
        }
    }

    return (
        <ModelComponentWithExternalControl
            open={open}
            onOpenChange={onOpenChange}
            title={`Edit Roles for ${userName}`}
            description="Manage the roles assigned to this staff member."
        >
            <div className="flex flex-col gap-6 py-4">
                {loading ? (
                    <div className="text-sm text-gray-500">Loading roles...</div>
                ) : (
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Assigned Roles</label>
                        <MultiSelectComboboxComponent
                            id="edit-user-roles"
                            value={selectedRoles}
                            onChange={setSelectedRoles}
                            options={availableRoles}
                            placeholder="Select roles..."
                        />
                    </div>
                )}

                <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSave} disabled={loading || saving}>
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </div>
        </ModelComponentWithExternalControl>
    )
}

export default EditUserRolesModal
