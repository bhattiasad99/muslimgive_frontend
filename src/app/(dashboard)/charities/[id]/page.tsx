import SingleCharityPageComponent from '@/components/use-case/SingleCharityPageComponent'
import { DUMMY_CHARITIES } from '@/DUMMY_CHARITIES'
import React from 'react'

type CharityDetailsPageProps = {
    params: {
        id: string
    }
}

const CharityDetailsPage = ({ params }: CharityDetailsPageProps) => {
    const { id } = params
    const charity = DUMMY_CHARITIES.find(eachCharity => eachCharity.id === id);
    if (!charity) {
        return <div>Charity not found</div>
    }

    return (
        <SingleCharityPageComponent {...charity} />
    )
}

export default CharityDetailsPage
