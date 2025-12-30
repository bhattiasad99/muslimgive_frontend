'use client'
import React, { FC, useState, useMemo } from 'react'
import ModelComponentWithExternalControl from '@/components/common/ModelComponent/ModelComponentWithExternalControl'
import { ControlledTextFieldComponent } from '@/components/common/TextFieldComponent/ControlledTextFieldComponent'
import { Button } from '@/components/ui/button'
import { TypographyComponent } from '@/components/common/TypographyComponent'
import ConfirmActionModal from '@/components/common/ConfirmActionModal'

type IProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const UpdatePasswordModal: FC<IProps> = ({ open, onOpenChange }) => {
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [showConfirm, setShowConfirm] = useState(false)

    const hasChanges = useMemo(() => {
        return oldPassword.length > 0 || newPassword.length > 0 || confirmPassword.length > 0
    }, [oldPassword, newPassword, confirmPassword])

    const handleUpdate = () => {
        setError('')
        
        if (!oldPassword || !newPassword || !confirmPassword) {
            setError('All fields are required')
            return
        }
        
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters')
            return
        }

        setShowConfirm(true)
    }

    const confirmUpdate = () => {
        // TODO: Call API to update password
        console.log('Updating password...')
        
        // Reset and close
        setOldPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setError('')
        onOpenChange(false)
    }

    const handleCancel = () => {
        setOldPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setError('')
        onOpenChange(false)
    }

    return (
        <>
            <ModelComponentWithExternalControl
                open={open}
                onOpenChange={onOpenChange}
                title="Change Password"
                description="Update your password to keep your account secure"
                dialogContentClassName="sm:max-w-[600px]"
            >
                <div className="flex flex-col gap-4">
                    <ControlledTextFieldComponent
                        type="password"
                        label="Old Password"
                        placeholder="Enter old password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />
                    
                    <ControlledTextFieldComponent
                        type="password"
                        label="New Password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    
                    <ControlledTextFieldComponent
                        type="password"
                        label="Confirm Password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    {error && (
                        <TypographyComponent className="text-red-500 text-sm">
                            {error}
                        </TypographyComponent>
                    )}

                    <div className="flex flex-col gap-3 mt-2">
                        <Button 
                            variant="primary" 
                            className="w-full"
                            onClick={handleUpdate}
                            disabled={!hasChanges}
                        >
                            Update Password
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
            <ConfirmActionModal
                open={showConfirm}
                onOpenChange={setShowConfirm}
                onConfirm={confirmUpdate}
                title="Confirm Password Change"
                description="Are you sure you want to change your password?"
                confirmText="Change Password"
                cancelText="Cancel"
            />
        </>
    )
}

export default UpdatePasswordModal
