import { TypographyComponent } from '@/components/common/TypographyComponent'
import React, { FC } from 'react'
import { SingleCharityType, StatusType } from '../CharitiesPageComponent/kanban/KanbanView'
import { StatusTypeComp } from '../CharitiesPageComponent/BulkEmailModal'
import { capitalizeWords, kebabToTitle } from '@/lib/helpers'
import YesIcon from '@/components/common/IconComponents/YesIcon'
import NoIcon from '@/components/common/IconComponents/NoIcon'
import AvatarGroupComponent from '@/components/common/AvatarGroupComponent'

type KeyValueProps = {
    label: string,
    value: string | number | React.ReactNode
}

const KeyValue: FC<KeyValueProps> = ({ label, value }) => {
    return <div className='flex flex-col gap-1 py-0.5 sm:flex-row sm:items-center sm:gap-2'>
        <TypographyComponent variant='body2' className='text-[#666E76] w-full sm:w-[180px] sm:flex-none'>{label}</TypographyComponent>
        <div className="flex-1">
            {typeof value === 'string' || typeof value === 'number' ? (
                <TypographyComponent variant='body2' className='text-[#101928] font-medium'>
                    {value}
                </TypographyComponent>
            ) : (
                value
            )}
        </div>
    </div>
}

type IProps = Partial<SingleCharityType>

const SingleCharityDetails: FC<IProps> = ({
    status,
    category,
    country,
    totalDuration,
    website,
    isThisMuslimCharity,
    doTheyPayZakat,
    members
}) => {

    return (
        <div className='flex flex-col gap-2'>
            <KeyValue label='Status:' value={<StatusTypeComp status={status as StatusType} className='justify-start' />} />
            {category ? <KeyValue label='Category:' value={kebabToTitle(category) || '-'} /> : null}
            {country ? <KeyValue label='Registered Country:' value={capitalizeWords(country) || '-'} /> : null}
            {totalDuration ? <KeyValue label='Total Duration:' value={totalDuration || '-'} /> : null}
            {website ? <KeyValue label='Website:' value={<a href={website.startsWith('http') ? website : `https://${website}`} target='_blank' className='text-blue-600 underline text-sm font-medium'>Click here to visit Website</a>} /> : null}
            <KeyValue label='Is this a Muslim charity?' value={isThisMuslimCharity ? <YesIcon /> : <NoIcon />} />
            <KeyValue label='Do they pay Zakat?' value={doTheyPayZakat ? <YesIcon /> : <NoIcon />} />
            <KeyValue label='Members:' value={<div className="">
                {members && members.length > 0 ? <AvatarGroupComponent images={members.map(eachMember => {
                    return {
                        source: eachMember.profilePicture,
                        id: eachMember.id,
                        fallback: ""
                    }
                })} /> : <>&#45;</>}
            </div>} />
        </div>
    )
}

export default SingleCharityDetails
