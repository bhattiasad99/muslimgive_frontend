import React, { FC } from 'react'
import KanbanColumn from './KanbanColumn'
import KanbanEffect from './KanbanEffect'

export type KanbanColType = {
    color: string
    title: string
    id: string
    cards?: SingleCardType[]
}

type Member = {
    name: string
    id: string
    profilePicture: string | null
}

export type SingleCardType = {
    id: string
    charityTitle: string
    charityOwnerName: string
    charityDesc: string
    members: Member[]
    comments: number
    auditsCompleted: 0 | 1 | 2 | 3 | 4
    status: string
}

type IProps = {
    charities: SingleCardType[]
}

const KanbanView: FC<IProps> = ({ charities }) => {
    const COLS: KanbanColType[] = [
        {
            color: '#F25CD4',
            title: 'Unassigned',
            id: 'unassigned',
        },
        {
            color: '#F25F5C',
            title: 'Pending Eligibility Review',
            id: 'pending-eligibility',
        },
        {
            color: '#5CD9F2',
            title: 'Open To Review',
            id: 'open-to-review',
        },
        {
            color: '#266DD3',
            title: 'Pending Review by Admin',
            id: 'pending-admin-review',
        },
        {
            color: '#5CF269',
            title: 'Approved',
            id: 'approved',
        },
        {
            color: '#112133',
            title: 'Ineligible',
            id: 'ineligible',
        },
    ]

    return (
        <KanbanEffect>
            {COLS.map(eachCol => {
                const charitiesAgainstStatus = [...charities.filter(eachCharity => {
                    return eachCharity.status === eachCol.id
                })];
                return (
                    <KanbanColumn
                        key={eachCol.id}
                        color={eachCol.color}
                        title={eachCol.title}
                        cards={charitiesAgainstStatus}
                    />
                )
            })}
        </KanbanEffect>
    )
}

export default KanbanView
