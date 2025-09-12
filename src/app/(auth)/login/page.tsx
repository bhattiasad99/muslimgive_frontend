import LinkComponent from '@/components/common/LinkComponent'
import { TextFieldComponent } from '@/components/common/TextFieldComponent'
import { Button } from '@/components/ui/button'
import AuthScreenLayoutComponent from '@/components/use-case/AuthScreenLayoutComponent'
import React from 'react'

const Login = () => {
    return (
        <AuthScreenLayoutComponent
            heading='Log in to your account'
            subHeading='Welcome back! Please enter your details'
        >
            <TextFieldComponent type="email" label="Email" placeholder='Enter Your Email' />
            <TextFieldComponent type="password" label="Password" placeholder='Enter Your Password' />
            <LinkComponent to="forgot-password" className="text-xs w-full text-left underline">Forgot Password?</LinkComponent>
            <Button className='w-full' variant={'primary'}>Login</Button>
        </AuthScreenLayoutComponent>
    )
}

export default Login