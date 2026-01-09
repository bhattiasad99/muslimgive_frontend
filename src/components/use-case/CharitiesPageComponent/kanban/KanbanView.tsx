import React, { FC } from 'react'
import KanbanColumn from './KanbanColumn'
import KanbanEffect from './KanbanEffect'

export type KanbanColType = {
    color: string
    title: string
    id: string
    cards?: SingleCharityType[]
}

export type BaseRoles = 'project-manager' | 'finance-auditor' | 'zakat-auditor' | 'admin'

export enum RolesEnum {
    'project-manager' = 'Project Manager',
    'finance-auditor' = 'Finance Auditor',
    'zakat-auditor' = 'Zakat Auditor',
    'admin' = 'Admin'
}

type Member = {
    name: string
    id: string
    profilePicture: string | null,
    role: BaseRoles
}

export type StatusType = 'pending-eligibility' | 'unassigned' | 'open-to-review' | 'pending-admin-review' | 'approved' | 'ineligible'

/**
 * categories:
 * International Relief
Overseas aid, emergency response, food, water, and shelter.

Local Relief
Support for local communities, food banks, homelessness, family aid.

Education
Schools, scholarships, Islamic learning, youth and skills development.

Masjid & Community Projects
Mosques, community centres, dawah, funeral services.

Health & Medical Aid
Hospitals, medical treatment, mental health, disability support.

Environment & Sustainability
Climate action, clean water, agriculture, and conservation.

Advocacy & Human Rights
Social justice, awareness, and legal support.


 */

export enum CategoryEnum {
    'international-relief' = 'International Relief',
    'local-relief' = 'Local Relief',
    'education' = 'Education',
    'masjid-community-projects' = 'Masjid & Community Projects',
    'health-medical-aid' = 'Health & Medical Aid',
    'environment-sustainability' = 'Environment & Sustainability',
    'advocacy-human-rights' = 'Advocacy & Human Rights',
}

export enum CountryEnum {
    'usa' = 'United States',
    'uk' = 'United Kingdom',
    'ca' = "Canada",
}

export type SingleCharityType = {
    id: string
    charityTitle: string
    charityOwnerName: string
    charityDesc: string
    members: Member[]
    comments: number
    auditsCompleted: 0 | 1 | 2 | 3 | 4
    status: StatusType,
    category: keyof typeof CategoryEnum,
    country?: keyof typeof CountryEnum,
    totalDuration?: string,
    website?: string,
    isThisMuslimCharity?: boolean,
    doTheyPayZakat?: boolean,
    verificationSummary?: {
        eligibility: {
            pending: boolean
            result: string
        }
        audits: {
            coreArea1: string
            coreArea2: string
            coreArea3: string
            coreArea4: string
            completed: number
            total: number
        }
        projectManagerAssigned: boolean
    }
}

type IProps = {
    charities: SingleCharityType[]
}

const KanbanView: FC<IProps> = ({ charities }) => {
    charities.forEach(({ country }) => {
        if (!country) return
        const countryName = CountryEnum[country as keyof typeof CountryEnum]
        if (countryName) {
            console.log(`Country selected: ${countryName}`)
        }
    })
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
        <div className="max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-sleek">
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
        </div>

    )
}

export default KanbanView
