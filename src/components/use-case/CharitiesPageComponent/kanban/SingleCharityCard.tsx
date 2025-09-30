'use client'
import React, { FC } from 'react'
import { SingleCardType } from './KanbanView'
import { TypographyComponent } from '@/components/common/TypographyComponent'
import { Card } from '@/components/ui/card'
import IconDropdownMenuComponent from '@/components/common/IconDropdownMenuComponent'
import ThreeDotIcon from '@/components/common/IconComponents/ThreeDotIcon'
import EmailIcon from '@/components/common/IconComponents/EmailIcon'
import OpenInNewTab from '@/components/common/IconComponents/OpenInNewTab'
import CardChatIcon from '@/components/common/IconComponents/CardChatIcon'
import DocumentIcon from '@/components/common/IconComponents/DocumentIcon'
import AvatarGroupComponent from '@/components/common/AvatarGroupComponent'

type IProps = Omit<SingleCardType, 'status'>

const SingleCharityCard: FC<IProps> = ({
    auditsCompleted,
    charityDesc,
    charityOwnerName,
    charityTitle,
    comments,
    id,
    members
}) => {
    const truncatedDesc =
        charityDesc.length > 100
            ? charityDesc.slice(0, 100) + '...'
            : charityDesc
    return (
        <Card className='p-4 flex flex-col gap-2 shadow-none bg-white'>
            <div className="flex flex-col gap-1 relative">
                <IconDropdownMenuComponent
                    className='absolute right-0 top-0 rotate-90 rounded-full'
                    icon={<ThreeDotIcon />}
                    options={[
                        {
                            value: 'email-logs',
                            label: <div className='flex gap-1 items-center'><EmailIcon color='#666E76' /><span>View Email Logs</span></div>
                        },
                        {
                            value: 'open-charity',
                            label: <div className='flex gap-1 items-center'><OpenInNewTab /><span>Open Charity</span></div>
                        },
                    ]}
                />
                <TypographyComponent variant='h5'>
                    {charityTitle}
                </TypographyComponent>
                <div className="text-xs text-[#000000]">{charityOwnerName}</div>
                <div className="text-xs text-[#666E76] text-justify">
                    {truncatedDesc}
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-xs text-[#666E76]">
                        Assigned MG Members ({members.length})
                    </span>
                    <div className="">
                        <AvatarGroupComponent images={[...members.map(eachMember => {
                            return {
                                source: eachMember.profilePicture,
                                id: eachMember.id,
                                fallback: ""
                            }
                        })]} />
                    </div>
                </div>
                <div className="h-[1px] w-full bg-[rgba(0,0,0,0.1)]">&nbsp;</div>
                <div className="flex items-center gap-4 text-xs text-[#666E76]">
                    <div className="flex items-center min-w-max gap-0.5">
                        <span>
                            <CardChatIcon /></span><span>{comments} Comments</span>
                    </div>
                    <div className="flex items-center min-w-max gap-0.5">
                        <span><DocumentIcon /></span><span>{auditsCompleted}/4 Audits Completed</span>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default SingleCharityCard