'use client'
import React, { FC, useMemo, useState, useTransition } from 'react'
import ModelComponentWithExternalControl from '@/components/common/ModelComponent/ModelComponentWithExternalControl'
import { ControlledTextFieldComponent } from '@/components/common/TextFieldComponent/ControlledTextFieldComponent'
import { Button } from '@/components/ui/button'
import { TypographyComponent } from '@/components/common/TypographyComponent'
import OtpComponent from '@/components/common/OtpComponent'
import { requestEmailChangeAction, resendEmailChangeAction, verifyEmailChangeAction } from '@/app/actions/users'
import { toast } from 'sonner'
import { signOut } from '@/auth/actions'
import { useRouter } from 'next/navigation'

type IProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
}

type Step = 'request' | 'verify'

const UpdateEmailModal: FC<IProps> = ({ open, onOpenChange }) => {
    const [step, setStep] = useState<Step>('request')
    const [newEmail, setNewEmail] = useState('')
    const [currentPassword, setCurrentPassword] = useState('')
    const [otp, setOtp] = useState('')
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [signOutPending, startTransition] = useTransition()
    const [resending, setResending] = useState(false)
    const router = useRouter()

    const hasRequestInput = useMemo(() => {
        return newEmail.trim().length > 0 && currentPassword.length > 0
    }, [newEmail, currentPassword])

    const handleClose = () => {
        setStep('request')
        setNewEmail('')
        setCurrentPassword('')
        setOtp('')
        setError('')
        onOpenChange(false)
    }

    const handleRequest = async () => {
        setError('')
        if (!newEmail || !currentPassword) {
            setError('New email and current password are required')
            return
        }

        setIsSubmitting(true)
        try {
            const res = await requestEmailChangeAction({
                newEmail,
                currentPassword,
            })

            if (res.ok) {
                toast.success('Verification code sent to your new email')
                setStep('verify')
                setOtp('')
                return
            }

            setError(res.message || 'Failed to send verification code')
            toast.error(res.message || 'Failed to send verification code')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleResend = async () => {
        setError('')
        setResending(true)
        try {
            const res = await resendEmailChangeAction({
                newEmail,
                currentPassword,
            })
            if (res.ok) {
                toast.success('Verification code resent')
                return
            }
            setError(res.message || 'Failed to resend verification code')
            toast.error(res.message || 'Failed to resend verification code')
        } finally {
            setResending(false)
        }
    }

    const handleVerify = async () => {
        setError('')
        if (!otp || otp.length !== 6) {
            setError('Enter the 6-digit code')
            return
        }

        setIsSubmitting(true)
        try {
            const res = await verifyEmailChangeAction({
                newEmail,
                otp,
            })

            if (res.ok) {
                toast.success('Email updated. Please sign in again.')
                startTransition(async () => {
                    const signOutRes = await signOut()
                    handleClose()
                    router.replace(signOutRes?.redirectTo ?? '/login')
                })
                return
            }

            setError(res.message || 'Invalid or expired code')
            toast.error(res.message || 'Invalid or expired code')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <ModelComponentWithExternalControl
            open={open}
            onOpenChange={onOpenChange}
            title="Update Email"
            description="Verify your new email with a one-time code"
            dialogContentClassName="sm:max-w-[600px]"
        >
            <div className="flex flex-col gap-4">
                {step === 'request' ? (
                    <>
                        <ControlledTextFieldComponent
                            type="email"
                            label="New Email"
                            placeholder="Enter new email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                        />
                        <ControlledTextFieldComponent
                            type="password"
                            label="Current Password"
                            placeholder="Enter current password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <TypographyComponent className="text-xs text-muted-foreground">
                            We will send a 6-digit code to your new email. The code expires in 5 minutes.
                        </TypographyComponent>
                    </>
                ) : (
                    <>
                        <TypographyComponent className="text-sm text-muted-foreground">
                            Enter the 6-digit code sent to <span className="font-medium text-foreground">{newEmail}</span>.
                        </TypographyComponent>
                        <OtpComponent
                            value={otp}
                            onChange={setOtp}
                            length={6}
                            autoFocus
                            showSeparator
                            separatorEvery={3}
                            containerClassName="justify-center"
                        />
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <span>Didn’t get the email?</span>
                            <Button
                                variant="link"
                                className="px-0 text-primary"
                                onClick={handleResend}
                                disabled={resending || isSubmitting || signOutPending}
                            >
                                {resending ? 'Resending...' : 'Resend email'}
                            </Button>
                        </div>
                    </>
                )}

                {error && (
                    <TypographyComponent className="text-red-500 text-sm">
                        {error}
                    </TypographyComponent>
                )}

                <div className="flex flex-col gap-3 mt-2">
                    {step === 'request' ? (
                        <>
                            <Button
                                variant="primary"
                                className="w-full"
                                onClick={handleRequest}
                                disabled={!hasRequestInput || isSubmitting || signOutPending}
                                loading={isSubmitting}
                            >
                                Send Verification Code
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full border-primary text-primary bg-white hover:bg-blue-50"
                                onClick={handleClose}
                            >
                                Cancel
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="primary"
                                className="w-full"
                                onClick={handleVerify}
                                disabled={otp.length !== 6 || isSubmitting || signOutPending}
                                loading={isSubmitting}
                            >
                                Verify & Update Email
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full border-primary text-primary bg-white hover:bg-blue-50"
                                onClick={handleClose}
                            >
                                Cancel
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </ModelComponentWithExternalControl>
    )
}

export default UpdateEmailModal
