'use client'

import React, { FC, useState } from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import AccordionHeader from './AccordionHeader'
import UserData from './UserData'

export type Role =
    | "Financial Auditor"
    | "Project Manager"
    | "Zakat Auditor"
    | "Operations Manager"
    | "MG Admin";

export type Data = {
    id: string
    firstName: string
    lastName: string
    email: string
    dateOfBirth: string
    phoneNumber: string
    location: string
    postalCode: string
    roles: Role[]
    status: 'Active' | 'Inactive',
    requestingPasswordReset: boolean
}

type IProps = { rows: Data[] }

const UsersExpandableTable: FC<IProps> = ({ rows }) => {
    const [openId, setOpenId] = useState<string | null>(null)

    return (
        <Accordion type="single" collapsible>
            {rows.map((eachUser) => {
                const isOpen = openId === eachUser.id
                const close = () => setOpenId(null)

                return (
                    <AccordionItem key={eachUser.id} value={eachUser.id}>
                        <AccordionTrigger asChild className="w-full">
                            <AccordionHeader {...{
                                close,
                                id: eachUser.id,
                                firstName: eachUser.firstName,
                                lastName: eachUser.lastName,
                                status: eachUser.status,
                                location: eachUser.location,
                                isOpen: isOpen,
                                setOpenId: setOpenId
                            }}
                            />
                        </AccordionTrigger>
                        <AccordionContent>
                            <UserData {
                                ...{
                                    id: eachUser.id,
                                    firstName: eachUser.firstName,
                                    lastName: eachUser.lastName,
                                    email: eachUser.email,
                                    dateOfBirth: eachUser.dateOfBirth,
                                    phoneNumber: eachUser.phoneNumber,
                                    location: eachUser.location,
                                    postalCode: eachUser.postalCode,
                                    roles: eachUser.roles,
                                    status: eachUser.status,
                                    requestingPasswordReset: eachUser.requestingPasswordReset
                                }
                            } />
                        </AccordionContent>
                    </AccordionItem>
                )
            })}
        </Accordion>
    )
}

export default UsersExpandableTable
