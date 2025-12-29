'use client'
import React, { FC, useState, useEffect } from 'react'
import ModelComponentWithExternalControl from '@/components/common/ModelComponent/ModelComponentWithExternalControl'
import { ControlledTextFieldComponent } from '@/components/common/TextFieldComponent/ControlledTextFieldComponent'
import DatePicker from '@/components/common/ControlledDatePickerComponent'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

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
    const [firstName, setFirstName] = useState(initialData.firstName)
    const [lastName, setLastName] = useState(initialData.lastName)
    const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(initialData.dateOfBirth)
    const [phoneNumber, setPhoneNumber] = useState(initialData.phoneNumber)

    useEffect(() => {
        if (open) {
            setFirstName(initialData.firstName)
            setLastName(initialData.lastName)
            setDateOfBirth(initialData.dateOfBirth)
            setPhoneNumber(initialData.phoneNumber)
        }
    }, [open, initialData])

    const handleUpdate = () => {
        onSave({
            firstName,
            lastName,
            dateOfBirth,
            phoneNumber
        })
        onOpenChange(false)
    }

    const handleCancel = () => {
        setFirstName(initialData.firstName)
        setLastName(initialData.lastName)
        setDateOfBirth(initialData.dateOfBirth)
        setPhoneNumber(initialData.phoneNumber)
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
        </ModelComponentWithExternalControl>
    )
}

export default EditPersonalInfoModal
