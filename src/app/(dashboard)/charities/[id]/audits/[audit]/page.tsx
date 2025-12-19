import { DUMMY_CHARITIES } from '@/DUMMY_CHARITIES'
import AuditPageContent from '../../../../../../components/use-case/SingleAuditPageComponent/audit-page-content'
import { AUDIT_DEFINITIONS, isAuditSlug } from '../../../../../../components/use-case/SingleAuditPageComponent/AUDIT_DEFINITIONS'
import { notFound } from 'next/navigation'
import { CountryEnum } from '@/components/use-case/CharitiesPageComponent/kanban/KanbanView'
import Preview from '@/components/use-case/SingleAuditPageComponent/Audits/Preview'

type CharityAuditPageProps = {
    params: { id: string; audit: string };
    searchParams?: { [key: string]: string | string[] | undefined };
};

export type CountryCode = keyof typeof CountryEnum

const CharityAuditPage = ({ params, searchParams }: CharityAuditPageProps) => {
    const { id, audit } = params;

    // i want to get the "preview-mode" variable from URL: http://localhost:3000/charities/c1/audits/core-area-1?preview-mode=true or http://localhost:3000/charities/c1/audits/core-area-1
    const previewModeParam = searchParams?.['preview-mode'];
    const previewMode = previewModeParam === 'true';
    const countryParam = searchParams?.country;
    const validCountries: CountryCode[] = ['usa', 'uk', 'ca']
    const countryFromQuery = validCountries.find((countryCode) => countryCode === countryParam)
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

    const resolvedCountry: CountryCode = countryFromQuery || charity.country || 'usa'
    const resolvedCountryName = CountryEnum[resolvedCountry] || CountryEnum.usa

    const charityTitle = `${charity.charityTitle} (${resolvedCountryName} Version)`

    if (previewMode) {
        return <Preview auditedBy={{
            name: "Rahima Issa",
            time: "2024-06-01T12:00:00Z"
        }}
            charityTitle={charityTitle}
            charityId={charity.id}
            auditSlug={audit}
            country={resolvedCountry}
        />
    }

    return (
        <AuditPageContent
            auditSlug={audit}
            auditTitle={auditDefinition.title}
            auditDescription={auditDefinition.description}
            charityId={charity.id}
            charityTitle={charityTitle}
            location={resolvedCountry}
        />
    )
}

export default CharityAuditPage
