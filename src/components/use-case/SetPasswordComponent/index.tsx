'use client'
import React, { FC, useActionState, useEffect, useMemo, useState } from 'react'
import AuthScreenLayoutComponent from '../AuthScreenLayoutComponent'
import { SetPasswordFormState } from '@/auth/forms';
import { setPasswordAction } from '@/auth/actions';
import { Button } from '@/components/ui/button';
import { ControlledTextFieldComponent } from '@/components/common/TextFieldComponent/ControlledTextFieldComponent';
import { useRouter } from 'next/navigation';

type IProps = {
    token: string
}

const PASSWORD_RULES = [
    { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
    { label: 'Uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
    { label: 'Lowercase letter', test: (p: string) => /[a-z]/.test(p) },
    { label: 'Number', test: (p: string) => /[0-9]/.test(p) },
    { label: 'Special character (e.g. @, !, #, $)', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

const SetPasswordComponent: FC<IProps> = ({ token }) => {
    const [state, action, pending] = useActionState(setPasswordAction, {} as SetPasswordFormState);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordTouched, setPasswordTouched] = useState(false);
    const [confirmTouched, setConfirmTouched] = useState(false);

    const ruleResults = useMemo(() =>
        PASSWORD_RULES.map(r => ({ label: r.label, passed: r.test(password) })),
        [password]
    );
    const passwordValid = ruleResults.every(r => r.passed);
    const passwordsMatch = password === confirmPassword;

    const noErrors = Object.keys(state?.errors || {}).length === 0;
    const isDisabled = useMemo(() => {
        if (pending) return true;
        if (!passwordValid) return true;
        if (!confirmPassword || !passwordsMatch) return true;
        return false;
    }, [pending, passwordValid, confirmPassword, passwordsMatch]);

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
    }, [noErrors, state?.message, router]);

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
                label="Set new Password"
                placeholder='Enter Password'
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordTouched(true);
                    setShowErrors(false);
                }}
            />

            {/* Live password requirements checklist — hides each rule once satisfied */}
            {passwordTouched && ruleResults.some(r => !r.passed) && (
                <ul className="w-full space-y-1 mb-1">
                    {ruleResults.filter(r => !r.passed).map(r => (
                        <li key={r.label} className="flex items-center gap-1.5 text-xs text-red-500">
                            <span>✗</span>
                            {r.label}
                        </li>
                    ))}
                </ul>
            )}

            {showErrors && state?.errors?.password && (
                <p className='text-red-500 text-xs text-left w-full'>{state.errors.password}</p>
            )}

            <ControlledTextFieldComponent
                id="set_password__confirmPassword"
                name="set_password__confirmPassword"
                type="password"
                label="Confirm Password"
                placeholder='Enter Password'
                value={confirmPassword}
                onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setConfirmTouched(true);
                    setShowErrors(false);
                }}
            />

            {/* Live match indicator */}
            {confirmTouched && confirmPassword && (
                <p className={`text-xs text-left w-full ${
                    passwordsMatch ? 'text-green-600' : 'text-red-500'
                }`}>
                    {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                </p>
            )}

            {showErrors && state?.errors?.confirmPassword && (
                <p className='text-red-500 text-xs text-left w-full'>{state.errors.confirmPassword}</p>
            )}

            {/* Success banner */}
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

            <Button disabled={isDisabled} className='w-full' variant={'primary'}>
                Create Password
            </Button>
        </AuthScreenLayoutComponent>
    )
}

export default SetPasswordComponent
