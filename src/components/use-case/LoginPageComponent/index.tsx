'use client'
import { signIn } from '@/app/actions/auth'
import { FormState } from '@/app/lib/definitions'
import LinkComponent from '@/components/common/LinkComponent'
import { ControlledTextFieldComponent } from '@/components/common/TextFieldComponent/ControlledTextFieldComponent'
import { Button } from '@/components/ui/button'
import AuthScreenLayoutComponent from '@/components/use-case/AuthScreenLayoutComponent'
import React, { useActionState, useEffect, useState } from 'react'

export default function LoginPageComponent({ continueTo = '/' }: { continueTo?: string }) {
    const [state, action, pending] = useActionState(signIn, {} as FormState);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const isDisabled = !email || !password;
    const [showErrors, setShowErrors] = useState(false);

    useEffect(() => {
        setShowErrors(!!state?.errors || !!state?.message);
    }, [state]);

    return (
        <AuthScreenLayoutComponent
            action={action}
            heading="Log in to your account"
            subHeading="Welcome back! Please enter your details"
        >
            <input type="hidden" name="continue" value={continueTo} />

            <div className="flex flex-col gap-1 w-full">
                <ControlledTextFieldComponent
                    type="email"
                    id="login__email"
                    name="login__email"
                    label="Email"
                    placeholder="Enter Your Email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setShowErrors(false); }}
                />
                {showErrors ? state?.errors?.email && (
                    <p className='text-red-500 text-xs text-left w-full'>{state.errors.email}</p>
                ) : null}
            </div>

            <div className="flex flex-col gap-1 w-full">
                <ControlledTextFieldComponent
                    type="password"
                    id="login__password"
                    name="login__password"
                    label="Password"
                    placeholder="Enter Your Password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setShowErrors(false); }}
                />
                {showErrors ? state?.errors?.password && (
                    <p className='text-red-500 text-xs text-left w-full'>{state.errors.password}</p>
                ) : null}
            </div>
            <LinkComponent
                to="forgot-password"
                className="text-xs w-full text-left underline"
            >
                Forgot Password?
            </LinkComponent>
            {showErrors && state?.message && (
                <div className="w-full text-sm text-red-600 border border-red-200 bg-red-50 rounded p-2">
                    {state.message}
                </div>
            )}

            <Button className="w-full" variant="primary" type="submit" disabled={isDisabled || pending} loading={pending}>
                Login
            </Button>
        </AuthScreenLayoutComponent>
    )
}
