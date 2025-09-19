import { TextFieldComponent } from '@/components/common/TextFieldComponent'
import { Button } from '@/components/ui/button'
import AuthScreenLayoutComponent from '@/components/use-case/AuthScreenLayoutComponent'
import React from 'react'

const resetPassAction = async () => {
    'use server'
}

const ResetPassword = () => {
    return (
        <AuthScreenLayoutComponent
            action={resetPassAction}
            heading='Reset Password'
            subHeading='Please enter new password'
        >
            <TextFieldComponent type="password" label="Set new Password" placeholder='Enter Password' />
            <TextFieldComponent type="password" label="Confirm Password" placeholder='Enter Password' />
            <Button className='w-full' variant={'primary'}>Reset Password</Button>
        </AuthScreenLayoutComponent>
    )
}

export default ResetPassword