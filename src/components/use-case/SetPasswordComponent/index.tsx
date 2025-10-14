'use client'
import React, { useActionState, useEffect, useState } from 'react'
import AuthScreenLayoutComponent from '../AuthScreenLayoutComponent'
import { SetPasswordFormState } from '@/app/lib/definitions';
import { setPasswordAction } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { ControlledTextFieldComponent } from '@/components/common/TextFieldComponent/ControlledTextFieldComponent';

const SetPasswordComponent = () => {
    const [state, action, pending] = useActionState(setPasswordAction, {} as SetPasswordFormState);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const isDisabled = !password || !confirmPassword;
    const [showErrors, setShowErrors] = useState(false);

    useEffect(() => {
        setShowErrors(!!state?.errors || !!state?.message);
    }, [state]);

    return (
        <AuthScreenLayoutComponent
            action={action}
            heading='Create Password'
            subHeading='Please enter new password'
        >
            <ControlledTextFieldComponent
                name="set_password__password"
                type="password"
                id="set_password__password"
                label="Set new Password" placeholder='Enter Password'
                value={password}
                onChange={(e) => { setPassword(e.target.value); setShowErrors(false); }}
            />
            {showErrors ? state?.errors?.password && (
                <p className='text-red-500 text-xs text-left w-full'>{state.errors.password}</p>
            ) : null}
            <ControlledTextFieldComponent
                id="set_password__confirmPassword"
                name="set_password__confirmPassword"
                type="password"
                label="Confirm Password"
                placeholder='Enter Password'
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setShowErrors(false); }}
            />
            {showErrors ? state?.errors?.confirmPassword && (
                <p className='text-red-500 text-xs text-left w-full'>{state.errors.confirmPassword}</p>
            ) : null}
            {showErrors && state?.message && (
                <div className="w-full text-sm text-red-600 border border-red-200 bg-red-50 rounded p-2">
                    {state.message}
                </div>
            )}
            <Button disabled={isDisabled} className='w-full'
                variant={'primary'}
            >Create Password</Button>
        </AuthScreenLayoutComponent>
    )
}

export default SetPasswordComponent