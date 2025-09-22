'use client'
import { Button } from '@/components/ui/button'
import React, { useTransition } from 'react'
import SignOut from '../../common/IconComponents/pages_icons/SignOut'
import { signOut } from '@/app/actions/auth'
import { useRouter } from 'next/navigation'

const SignOutBtnInSidebar = () => {
    const [pending, start] = useTransition()
    const router = useRouter()

    return (
        <div className="p-3 w-full">
            <Button loading={pending} onClick={() =>
                start(async () => {
                    const res = await signOut()
                    router.replace(res?.redirectTo ?? '/login')
                })
            }
                variant={"ghost"} className="w-full justify-start items-center"><span><SignOut /></span>Sign Out</Button>
        </div>
    )
}

export default SignOutBtnInSidebar