'use client'
import { signOut } from '@/auth/actions'
import { Button } from '@/components/ui/button'
import React, { FC, useTransition } from 'react'

type IProps = {
    children: React.ReactNode
}

const SignOutBtnInHome: FC<IProps> = ({ children }) => {
    const [pending, start] = useTransition()
    return (
        <Button loading={pending} variant={"outline"} onClick={() => {
            // sign out
            start(() => {
                signOut()
            })
        }}> {children}</Button >
    )
}

export default SignOutBtnInHome
