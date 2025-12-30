'use client'
import React, { FC, useState, useEffect, useMemo } from 'react'
import ModelComponentWithExternalControl from '@/components/common/ModelComponent/ModelComponentWithExternalControl'
import { ControlledTextFieldComponent } from '@/components/common/TextFieldComponent/ControlledTextFieldComponent'
import DatePicker from '@/components/common/ControlledDatePickerComponent'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import ConfirmActionModal from '@/components/common/ConfirmActionModal'

type PersonalInfo = {
    firstName: string
    lastName: string
    dateOfBirth: Date | undefined
    phoneNumber: string
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
    const [phoneNumber, setPhoneNumber] = useState('')
    const [showConfirm, setShowConfirm] = useState(false)
    const [capturedInitial, setCapturedInitial] = useState<PersonalInfo>({
        firstName: '',
        lastName: '',
        dateOfBirth: undefined,
        phoneNumber: ''
    })

    useEffect(() => {
        if (open) {
            setFirstName(initialData.firstName)
            setLastName(initialData.lastName)
            setDateOfBirth(initialData.dateOfBirth)
            setPhoneNumber(initialData.phoneNumber)
            setCapturedInitial({ ...initialData })
        }
    }, [open])

    const hasChanges = useMemo(() => {
        return (
            firstName !== capturedInitial.firstName ||
            lastName !== capturedInitial.lastName ||
            dateOfBirth?.getTime() !== capturedInitial.dateOfBirth?.getTime() ||
            phoneNumber !== capturedInitial.phoneNumber
        )
    }, [firstName, lastName, dateOfBirth, phoneNumber, capturedInitial])

    const handleUpdate = () => {
        setShowConfirm(true)
    }

    const confirmUpdate = () => {
        onSave({
            firstName,
            lastName,
            dateOfBirth,
            phoneNumber
        })
        onOpenChange(false)
    }

    const handleCancel = () => {
        setFirstName(capturedInitial.firstName)
        setLastName(capturedInitial.lastName)
        setDateOfBirth(capturedInitial.dateOfBirth)
        setPhoneNumber(capturedInitial.phoneNumber)
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
                    onChange={(e) => setFirstName(e.target.value)}
                />
                
                <ControlledTextFieldComponent
                    label="Last Name"
                    placeholder="Enter last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
                
                <div className="flex flex-col gap-1">
                    <Label className="text-sm">Date of Birth</Label>
                    <DatePicker
                        value={dateOfBirth}
                        onChange={setDateOfBirth}
                        placeholder="Select date of birth"
                        disabledFutureDates
                    />
                </div>

                <ControlledTextFieldComponent
                    label="Phone Number"
                    placeholder="+1 (123) 456-7890"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />

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
            />
        </ModelComponentWithExternalControl>
    )
}

export default EditPersonalInfoModal
