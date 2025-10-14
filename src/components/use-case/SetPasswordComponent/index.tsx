'use client'
import React, { FC, useActionState, useEffect, useMemo, useState } from 'react'
import AuthScreenLayoutComponent from '../AuthScreenLayoutComponent'
import { SetPasswordFormState } from '@/app/lib/definitions';
import { setPasswordAction } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { ControlledTextFieldComponent } from '@/components/common/TextFieldComponent/ControlledTextFieldComponent';
import { useRouter } from 'next/navigation';

type IProps = {
    token: string
}

const SetPasswordComponent: FC<IProps> = ({ token }) => {
    const [state, action, pending] = useActionState(setPasswordAction, {} as SetPasswordFormState);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    // compute disabled
    const noErrors = Object.keys(state?.errors || {}).length === 0;
    const isDisabled = useMemo(() => {
        if (!noErrors) return true // lock UI after success
        if (pending) return true
        if (!password || !confirmPassword) return true
        if (password !== confirmPassword) return true
        return false
    }, [noErrors, pending, password, confirmPassword])
    const [showErrors, setShowErrors] = useState(false);

    useEffect(() => {
        setShowErrors(!!state?.errors || !!state?.message);
    }, [state]);
    const router = useRouter();
    useEffect(() => {
        if (noErrors && state?.message) {
            setPassword('');
            setConfirmPassword('');

            const t = setTimeout(() => router.replace('/login'), 1200)
            return () => clearTimeout(t)
        }
    }, [noErrors, state?.message]);

    return (
        <AuthScreenLayoutComponent
            action={action}
            heading='Create Password'
            subHeading='Please enter new password'
        >
            <input type="hidden" name="token" value={token} />
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
            {/* success banner */}
            {noErrors && state?.message && (
                <div className="w-full text-sm text-green-700 border border-green-200 bg-green-50 rounded p-2">
                    {state.message}
                </div>
            )}
            {!noErrors && showErrors && state?.message && (
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