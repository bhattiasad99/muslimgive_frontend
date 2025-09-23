import React, { FC } from 'react'
import { Data } from './'
import AvatarComponent from '@/components/common/AvatarComponent';
import { capitalizeWords } from '@/lib/helpers'
import { cn } from '@/lib/utils';
import { kanit } from '@/app/fonts';
import UserCardLayout from './UserCardLayout';
import { Button } from '@/components/ui/button';
import EditIcon from '@/components/common/IconComponents/EditIcon';
import SimpleCardDataFormat from './SimpleCardDataFormat';

type IProps = Data;

const UserData: FC<IProps> = ({
    id,
    firstName,
    lastName,
    email,
    dateOfBirth,
    phoneNumber,
    location,
    postalCode,
    roles,
    status,
    requestingPasswordReset
}) => {
    const [city, country] = location.split(',').map(el => el.trim())
    return (
        <div className='p-4 flex gap-5'>
            <div className="min-w-[342px] flex flex-col gap-4">
                <AvatarComponent fallback={`${firstName ? firstName[0] : ''}${lastName ? lastName[0] : ''}`} />
                <span className='text-2xl font-semibold'>{capitalizeWords(firstName)} {capitalizeWords(lastName)}</span>
                <span className='text-[#666E76] '>{email}</span>
                <div className="flex gap-4 items-center">
                    <div className={cn("w-full bg-[rgba(187,201,222,0.2)] border border-[rgba(0,0,0,0.1)] rounded-lg py-1 px-2 text-sm ", kanit.className)}>
                        <span>
                            User ID:
                        </span>{" "}
                        <span className='font-light text-gray-600'>
                            {id}
                        </span>
                    </div>
                    <button className='bg-[rgba(187,201,222,0.2)] border border-[rgba(0,0,0,0.1)] rounded-2xl h-full px-4'>Copy</button>
                </div>
                {requestingPasswordReset ? <Button variant={"primary"} className='w-full'>Requesting Password Reset</Button> : null}
            </div>
            <div className="w-full flex flex-col gap-6">
                <UserCardLayout headingText='Personal Information'>
                    <SimpleCardDataFormat items={[
                        {
                            firstName: capitalizeWords(firstName)
                        },
                        {
                            lastName: capitalizeWords(lastName)
                        },
                        {
                            dateOfBirth: capitalizeWords(dateOfBirth)
                        },
                        {
                            phoneNumber
                        }
                    ]} />
                </UserCardLayout>
                <UserCardLayout headingText='Address'>
                    <SimpleCardDataFormat items={[
                        {
                            city: capitalizeWords(city)
                        },
                        {
                            country: capitalizeWords(country)
                        },
                        {
                            postalCode
                        },
                    ]} />
                </UserCardLayout>
                <UserCardLayout
                    headingText='Professional Information'
                    action={
                        <Button
                            className='rounded-lg'
                            variant={"primary"}
                            size={"sm"}>
                            <span>
                                <EditIcon />
                            </span>
                            {" "}Edit
                        </Button>
                    }
                >
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-2">
                            <div className="text-xs font-normal text-[#666E76]">Roles</div>
                            <div className="flex gap-2">
                                {roles.length === 0 ? <>No Role Assigned</> : <>
                                    {roles.map(eachRole => <p key={eachRole} className={cn("min-w-[50px] text-gray-600 bg-gray-100 border border-gray-300 text-xs p-0.5 rounded-lg flex justify-center font-normal px-2", kanit.className)}>
                                        {capitalizeWords(eachRole)}
                                    </p>)}
                                </>}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="text-xs font-normal text-[#666E76]">Status</div>
                            <p
                                className={cn(
                                    'px-3 py-0.5 text-xs w-fit rounded-lg flex justify-center border',
                                    status === 'Active'
                                        ? 'bg-[#5CF269] border-[#57de62]'
                                        : 'bg-[#F25F5C] text-white border-[#e75b59]'
                                )}
                            >
                                {status}
                            </p>
                        </div>
                    </div>
                </UserCardLayout>
            </div>
        </div>
    )
}

export default UserData