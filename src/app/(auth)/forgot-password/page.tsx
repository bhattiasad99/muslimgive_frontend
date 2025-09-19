import LinkComponent from '@/components/common/LinkComponent'
import { TextFieldComponent } from '@/components/common/TextFieldComponent'
import { Button } from '@/components/ui/button'
import AuthScreenLayoutComponent from '@/components/use-case/AuthScreenLayoutComponent'
import React from 'react'

const forgetPasswordAction = async () => {
    'use server'

}

const ForgotPassword = () => {
    return (
        <AuthScreenLayoutComponent
            action={forgetPasswordAction}
            heading='Forgot Your Password?'
            subHeading='Please enter email to recover Password'
        >
            <TextFieldComponent type="email" label="Email" placeholder='Enter Your Email' />
            <Button className='w-full' variant={'primary'}>Request Email Reset</Button>
            <LinkComponent to="login" className="text-xs w-full text-center">Back to <span className='underline'>Sign In</span></LinkComponent>
        </AuthScreenLayoutComponent>
    )
}

export default ForgotPassword