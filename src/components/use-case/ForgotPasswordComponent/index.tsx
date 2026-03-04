'use client'
import React, { useActionState, useEffect, useState } from 'react'
import AuthScreenLayoutComponent from '../AuthScreenLayoutComponent'
import { forgotPasswordAction } from '@/auth/actions'
import { ForgotPasswordFormState } from '@/auth/forms'
import { Button } from '@/components/ui/button'
import { ControlledTextFieldComponent } from '@/components/common/TextFieldComponent/ControlledTextFieldComponent'
import LinkComponent from '@/components/common/LinkComponent'

const ForgotPasswordComponent = () => {
    const [state, action, pending] = useActionState(forgotPasswordAction, undefined as ForgotPasswordFormState)
    const [email, setEmail] = useState('')

    // Keep email field reactive so we can clear it on success
    useEffect(() => {
        if (state?.success) setEmail('')
    }, [state?.success])

    return (
        <AuthScreenLayoutComponent
            action={action}
            heading='Forgot Your Password?'
            subHeading='Please enter your email to receive a reset link'
        >
            <ControlledTextFieldComponent
                id="forgot_password__email"
                name="forgot_password__email"
                type="email"
                label="Email"
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            {state?.errors?.email && (
                <p className="text-red-500 text-xs text-left w-full">{state.errors.email}</p>
            )}

            {/* Success banner */}
            {state?.success && state.message && (
                <div className="w-full text-sm text-green-700 border border-green-200 bg-green-50 rounded p-2">
                    {state.message}
                </div>
            )}

            {/* Error banner */}
            {state?.success === false && state.message && (
                <div className="w-full text-sm text-red-600 border border-red-200 bg-red-50 rounded p-2">
                    {state.message}
                </div>
            )}

            <Button
                className="w-full"
                variant="primary"
                disabled={pending || !email}
            >
                {pending ? 'Sending…' : 'Request Password Reset'}
            </Button>

            <LinkComponent to="login" className="text-xs w-full text-center">
                Back to <span className="underline">Sign In</span>
            </LinkComponent>
        </AuthScreenLayoutComponent>
    )
}

export default ForgotPasswordComponent
