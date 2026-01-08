import SingleCharityPageComponent from '@/components/use-case/SingleCharityPageComponent'
import { getCharityAction } from '@/app/actions/charities'
import React from 'react'
import { SingleCharityType } from '@/components/use-case/CharitiesPageComponent/kanban/KanbanView'

type CharityDetailsPageProps = {
    params: {
        id: string
    }
}

const CharityDetailsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params

    const res = await getCharityAction(id)

    if (!res.ok || !res.payload?.data?.data) {
        return <div className="p-6">Charity not found or an error occurred.</div>
    }

    const c = res.payload.data.data;
    const charity: SingleCharityType = {
        id: c.id,
        charityTitle: c.name,
        charityOwnerName: c.ownerName || "-",
        charityDesc: c.description || "",
        members: (c.assignments || []).map((a: any) => ({
            id: a.user?.id,
            name: `${a.user?.firstName} ${a.user?.lastName}`,
            profilePicture: null,
            role: a.roles?.[0]?.slug || 'project-manager'
        })),
        comments: c.commentsCount || 0,
        auditsCompleted: (c.reviews?.summary?.completed || 0) as any,
        status: c.status || 'unassigned',
        category: c.category || 'education',
        country: c.countryCode || c.country,
        website: c.charityCommissionWebsiteUrl,
        isThisMuslimCharity: c.isIslamic,
        doTheyPayZakat: c.doesCharityGiveZakat,
        totalDuration: c.startDate ? `${Math.max(1, Math.floor((Date.now() - new Date(c.startDate).getTime()) / (1000 * 60 * 60 * 24 * 365)))} years` : undefined
    }


    return (
        <SingleCharityPageComponent {...charity} />
    )
}


export default CharityDetailsPage
