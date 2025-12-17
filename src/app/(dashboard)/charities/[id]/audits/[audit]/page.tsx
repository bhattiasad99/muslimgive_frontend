import { DUMMY_CHARITIES } from '@/DUMMY_CHARITIES'
import AuditPageContent from '../../../../../../components/use-case/SingleAuditPageComponent/audit-page-content'
import { AUDIT_DEFINITIONS, isAuditSlug } from '../../../../../../components/use-case/SingleAuditPageComponent/AUDIT_DEFINITIONS'
import { notFound } from 'next/navigation'

type CharityAuditPageProps = {
    params: {
        id: string;
        audit: string;
    }
}

const CharityAuditPage = ({ params }: CharityAuditPageProps) => {
    const { id, audit } = params;

    // i want to get the "preview-mode" variable from URL: http://localhost:3000/charities/c1/audits/core-area-1?preview-mode=true or http://localhost:3000/charities/c1/audits/core-area-1
    const urlSearchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const previewModeParam = urlSearchParams.get('preview-mode');
    const previewMode = previewModeParam === 'true' ? true : previewModeParam === 'false' ? false : undefined;
    // if preview-mode is not present, it should lead to the normal audit page
    // if preview-mode is true, it should lead to the preview audit page
    // if preview-mode is false, it should lead to the normal audit page

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
            isPreviewMode={!!previewMode}
            location={charity.country || 'usa'}
        />
    )
}

export default CharityAuditPage
