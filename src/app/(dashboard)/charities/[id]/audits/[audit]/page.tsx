import { getCharityAction } from '@/app/actions/charities'
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

const CharityAuditPage = async ({ params, searchParams }: {
    params: Promise<{ id: string; audit: string }>,
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
    const { id, audit } = await params;
    const resolvedSearchParams = await searchParams;

    // i want to get the "preview-mode" variable from URL
    const previewModeParam = resolvedSearchParams?.['preview-mode'];
    const previewMode = previewModeParam === 'true';
    const countryParam = resolvedSearchParams?.country;

    const validCountries: CountryCode[] = ['usa', 'uk', 'ca']
    const countryFromQuery = validCountries.find((countryCode) => countryCode === countryParam)
    // if preview-mode is not present, it should lead to the normal audit page
    // if preview-mode is true, it should lead to the preview audit page
    // if preview-mode is false, it should lead to the normal audit page

    const res = await getCharityAction(id)

    if (!isAuditSlug(audit)) {
        return notFound()
    }

    if (!res.ok || !res.payload?.data?.data) {
        return notFound()
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const c = res.payload.data.data;
    const charity = {
        id: c.id,
        charityTitle: c.name,
        country: c.countryCode || c.country,
    }

    const auditDefinition = AUDIT_DEFINITIONS[audit]

    if (!auditDefinition) {
        return notFound()
    }

    // Map backend country codes (e.g., 'uk', 'usa') to frontend CountryCode keys if needed
    // Assuming backend returns 'uk', 'usa', 'canada' or similar which need to be mapped to 'uk', 'usa', 'ca'
    let fetchedCountryCode: CountryCode = 'usa';
    if (charity.country) {
        const lowerCountry = charity.country.toLowerCase();
        if (lowerCountry === 'uk' || lowerCountry === 'united kingdom') fetchedCountryCode = 'uk';
        else if (lowerCountry === 'usa' || lowerCountry === 'united states' || lowerCountry === 'us') fetchedCountryCode = 'usa';
        else if (lowerCountry === 'ca' || lowerCountry === 'canada') fetchedCountryCode = 'ca';
    }

    const resolvedCountry: CountryCode = countryFromQuery || fetchedCountryCode;
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
