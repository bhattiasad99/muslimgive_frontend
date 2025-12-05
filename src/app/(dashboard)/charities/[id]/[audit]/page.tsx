import AuditPageContent from '../../../../../components/use-case/SingleAuditPageComponent/audit-page-content'
import { AUDIT_DEFINITIONS, isAuditSlug } from '../../../../../components/use-case/SingleAuditPageComponent/audit-definitions'
import { notFound } from 'next/navigation'
import { DUMMY_CHARITIES } from '@/DUMMY_CHARITIES'

type CharityAuditPageProps = {
    params: {
        id: string;
        audit: string;
    }
}

const CharityAuditPage = ({ params }: CharityAuditPageProps) => {
    const { id, audit } = params

    if (!isAuditSlug(audit)) {
        return notFound()
    }

    const charity = DUMMY_CHARITIES.find((eachCharity) => eachCharity.id === id)
    const auditDefinition = AUDIT_DEFINITIONS[audit]

    if (!charity || !auditDefinition) {
        return notFound()
    }

    return (
        <AuditPageContent
            auditSlug={audit}
            auditTitle={auditDefinition.title}
            auditDescription={auditDefinition.description}
            charityId={charity.id}
            charityTitle={charity.charityTitle}
        />
    )
}

export default CharityAuditPage
