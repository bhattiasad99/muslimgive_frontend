'use client'
import { Button } from '@/components/ui/button'
import React, { useTransition } from 'react'
import SignOut from '../../common/IconComponents/pages_icons/SignOut'
import { signOut } from '@/app/actions/auth'

const SignOutBtnInSidebar = () => {
    const [pending, start] = useTransition()
    return (
        <div className="p-3 w-full">
            <Button loading={pending} onClick={() => start(() => signOut())} variant={"ghost"} className="w-full justify-start items-center"><span><SignOut /></span>Sign Out</Button>
        </div>
    )
}

export default SignOutBtnInSidebar