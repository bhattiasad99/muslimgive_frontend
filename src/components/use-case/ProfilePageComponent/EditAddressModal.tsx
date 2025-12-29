'use client'
import React, { FC, useState, useEffect } from 'react'
import ModelComponentWithExternalControl from '@/components/common/ModelComponent/ModelComponentWithExternalControl'
import { ControlledTextFieldComponent } from '@/components/common/TextFieldComponent/ControlledTextFieldComponent'
import { Button } from '@/components/ui/button'

type AddressInfo = {
    country: string
    city: string
    postalCode: string
}

type IProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    initialData: AddressInfo
    onSave: (data: AddressInfo) => void
}

const EditAddressModal: FC<IProps> = ({ open, onOpenChange, initialData, onSave }) => {
    const [country, setCountry] = useState(initialData.country)
    const [city, setCity] = useState(initialData.city)
    const [postalCode, setPostalCode] = useState(initialData.postalCode)

    useEffect(() => {
        if (open) {
            setCountry(initialData.country)
            setCity(initialData.city)
            setPostalCode(initialData.postalCode)
        }
    }, [open, initialData])

    const handleUpdate = () => {
        onSave({
            country,
            city,
            postalCode
        })
        onOpenChange(false)
    }

    const handleCancel = () => {
        setCountry(initialData.country)
        setCity(initialData.city)
        setPostalCode(initialData.postalCode)
        onOpenChange(false)
    }

    return (
        <ModelComponentWithExternalControl
            open={open}
            onOpenChange={onOpenChange}
            title="Edit Address"
            description="Update your address information"
            dialogContentClassName="sm:max-w-[600px]"
        >
            <div className="flex flex-col gap-4">
                <ControlledTextFieldComponent
                    label="Country"
                    placeholder="Enter country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                />
                
                <ControlledTextFieldComponent
                    label="City"
                    placeholder="Enter city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                
                <ControlledTextFieldComponent
                    label="Postal Code"
                    placeholder="Enter postal code"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
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

export default EditAddressModal
