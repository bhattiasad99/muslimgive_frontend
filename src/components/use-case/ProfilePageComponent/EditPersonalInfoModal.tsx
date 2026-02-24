'use client'
import React, { FC, useState, useEffect, useMemo } from 'react'
import ModelComponentWithExternalControl from '@/components/common/ModelComponent/ModelComponentWithExternalControl'
import { ControlledTextFieldComponent } from '@/components/common/TextFieldComponent/ControlledTextFieldComponent'
import DatePicker from '@/components/common/ControlledDatePickerComponent'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import ConfirmActionModal from '@/components/common/ConfirmActionModal'
import { updateMeAction, UpdateMePayload } from '@/app/actions/users'
import { toast } from 'sonner'
import { formatDateToYYYYMMDD } from '@/lib/helpers'

type PersonalInfo = {
    firstName: string
    lastName: string
    dateOfBirth: Date | undefined
}

type IProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    initialData: PersonalInfo
    onSave: (data: PersonalInfo) => void
}

const EditPersonalInfoModal: FC<IProps> = ({ open, onOpenChange, initialData, onSave }) => {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined)
    const [showConfirm, setShowConfirm] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const [errors, setErrors] = useState<{ firstName?: string, lastName?: string }>({})
    const [capturedInitial, setCapturedInitial] = useState<PersonalInfo>({
        firstName: '',
        lastName: '',
        dateOfBirth: undefined
    })

    useEffect(() => {
        if (open) {
            setFirstName(initialData.firstName)
            setLastName(initialData.lastName)
            setDateOfBirth(initialData.dateOfBirth)
            setCapturedInitial({ ...initialData })
        }
    }, [open, initialData])

    const hasChanges = useMemo(() => {
        return (
            firstName !== capturedInitial.firstName ||
            lastName !== capturedInitial.lastName ||
            dateOfBirth?.getTime() !== capturedInitial.dateOfBirth?.getTime()
        )
    }, [firstName, lastName, dateOfBirth, capturedInitial])

    const handleUpdate = () => {
        const newErrors: { firstName?: string, lastName?: string } = {}
        if (!firstName.trim()) {
            newErrors.firstName = 'First name is required'
        }
        if (!lastName.trim()) {
            newErrors.lastName = 'Last name is required'
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        setErrors({})
        setShowConfirm(true)
    }

    const confirmUpdate = async () => {
        // Build payload with only changed fields
        const changedPayload: UpdateMePayload = {}
        if (firstName !== capturedInitial.firstName) changedPayload.firstName = firstName
        if (lastName !== capturedInitial.lastName) changedPayload.lastName = lastName
        if (dateOfBirth?.getTime() !== capturedInitial.dateOfBirth?.getTime()) {
            changedPayload.dateOfBirth = formatDateToYYYYMMDD(dateOfBirth)
        }

        setIsUpdating(true)
        try {
            const res = await updateMeAction(changedPayload)
            if (res.ok) {
                toast.success('Personal information updated successfully')
                onSave({
                    firstName,
                    lastName,
                    dateOfBirth
                })
                onOpenChange(false)
            } else {
                toast.error(res.message || 'Failed to update personal information')
            }
        } catch (error) {
            console.error(error)
            toast.error('An error occurred while updating')
        } finally {
            setIsUpdating(false)
            setShowConfirm(false)
        }
    }

    const handleCancel = () => {
        setFirstName(capturedInitial.firstName)
        setLastName(capturedInitial.lastName)
        setDateOfBirth(capturedInitial.dateOfBirth)
        onOpenChange(false)
    }

    return (
        <ModelComponentWithExternalControl
            open={open}
            onOpenChange={onOpenChange}
            title="Edit Personal Information"
            description="Update your personal details"
            dialogContentClassName="sm:max-w-[600px]"
        >
            <div className="flex flex-col gap-4">
                <ControlledTextFieldComponent
                    label="First Name"
                    placeholder="Enter first name"
                    value={firstName}
                    onChange={(e) => {
                        setFirstName(e.target.value)
                        if (e.target.value.trim()) {
                            setErrors(prev => ({ ...prev, firstName: undefined }))
                        }
                    }}
                />
                {errors.firstName && <p className="text-red-500 text-xs -mt-3">{errors.firstName}</p>}

                <ControlledTextFieldComponent
                    label="Last Name"
                    placeholder="Enter last name"
                    value={lastName}
                    onChange={(e) => {
                        setLastName(e.target.value)
                        if (e.target.value.trim()) {
                            setErrors(prev => ({ ...prev, lastName: undefined }))
                        }
                    }}
                />
                {errors.lastName && <p className="text-red-500 text-xs -mt-3">{errors.lastName}</p>}

                <div className="flex flex-col gap-1">
                    <Label className="text-sm">Date of Birth</Label>
                    <DatePicker
                        value={dateOfBirth}
                        onChange={setDateOfBirth}
                        placeholder="Select date of birth"
                        disabledFutureDates
                    />
                </div>

                <div className="flex flex-col gap-3 mt-2">
                    <Button
                        variant="primary"
                        className="w-full"
                        onClick={handleUpdate}
                        disabled={!hasChanges}
                    >
                        Update Profile
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full border-primary text-primary bg-white hover:bg-blue-50"
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                </div>
            </div>

            <ConfirmActionModal
                open={showConfirm}
                onOpenChange={setShowConfirm}
                onConfirm={confirmUpdate}
                title="Confirm Update"
                description="Are you sure you want to update your personal information?"
                confirmText="Update Profile"
                isLoading={isUpdating}
            />
        </ModelComponentWithExternalControl>
    )
}

export default EditPersonalInfoModal
