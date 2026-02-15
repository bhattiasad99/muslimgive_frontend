import SingleCharityPageComponent from '@/components/use-case/SingleCharityPageComponent'
import { getCharityAction } from '@/app/actions/charities'
import { listUsersAction } from '@/app/actions/users'
import React from 'react'
import { SingleCharityType } from '@/components/use-case/CharitiesPageComponent/kanban/KanbanView'
import { redirect } from 'next/navigation'



const CharityDetailsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params

    const [res, pmUsersRes, financeUsersRes, zakatUsersRes] = await Promise.all([
        getCharityAction(id),
        listUsersAction({ limit: 200, role: 'project-manager' }),
        listUsersAction({ limit: 200, role: 'finance-auditor' }),
        listUsersAction({ limit: 200, role: 'zakat-auditor' }),
    ])

    const isUnauthenticated = [res, pmUsersRes, financeUsersRes, zakatUsersRes].some((r) => r?.unauthenticated)
    if (isUnauthenticated) {
        redirect(`/login?continue=${encodeURIComponent(`/charities/${id}`)}`)
    }

    if (!res.ok || !res.payload?.data?.data) {
        return <div className="p-6">Charity not found or an error occurred.</div>
    }

    const c = res.payload.data.data;
    console.log('Page Value Verification:', JSON.stringify(c.verificationSummary, null, 2));
    const toRoleSlug = (value: string) => value.trim().toLowerCase().replace(/\s+/g, '-');
    const mapCandidates = (source: any, requiredRole: 'project-manager' | 'finance-auditor' | 'zakat-auditor') => {
        const users = Array.isArray(source?.payload?.data) ? source.payload.data : []
        const filtered = users.filter((u: any) => {
            const roles: string[] = Array.isArray(u?.roles) ? u.roles : []
            return roles.some(r => toRoleSlug(String(r)) === requiredRole)
        })
        const deduped = new Map<string, { id: string; name: string; email: string | null }>()
        filtered.forEach((u: any) => {
            if (!u?.id) return
            deduped.set(u.id, {
                id: u.id,
                name: `${u.firstName} ${u.lastName}`.trim(),
                email: u.email ?? null,
            })
        })
        return Array.from(deduped.values())
    }
    const assignmentCandidatesByRole = {
        projectManager: pmUsersRes.ok ? mapCandidates(pmUsersRes, 'project-manager') : [],
        financeAuditor: financeUsersRes.ok ? mapCandidates(financeUsersRes, 'finance-auditor') : [],
        zakatAuditor: zakatUsersRes.ok ? mapCandidates(zakatUsersRes, 'zakat-auditor') : [],
    };
    const members = (c.assignments || []).flatMap((a: any) => {
        const userId = a.user?.id
        const name = `${a.user?.firstName} ${a.user?.lastName}`.trim()
        const roles = Array.isArray(a.roles) ? a.roles : []
        if (!userId || roles.length === 0) {
            return []
        }
        return roles.map((role: any) => ({
            id: userId,
            name,
            profilePicture: null,
            role: role?.slug || 'project-manager',
        }))
    })

    const charity: SingleCharityType = {
        id: c.id,
        charityTitle: c.name,
        charityOwnerName: c.submittedByName || (c.owner ? `${c.owner.firstName} ${c.owner.lastName}` : "-"),
        charityDesc: c.description || "",
        members,
        comments: c.commentsCount || 0,
        auditsCompleted: (c.reviews?.summary?.completed || 0) as any,
        status: c.status || 'unassigned',
        category: c.category ?? null,
        reassessmentCycle: c.reassessmentCycle ?? 0,
        overallScorePercent: c.overallScorePercent ?? null,
        overallScoreResult: c.overallScoreResult ?? null,
        country: c.countryCode || c.country,
        website: c.countryCode === 'united-kingdom'
            ? (c.ukCharityCommissionUrl || c.charityCommissionWebsiteUrl)
            : c.countryCode === 'canada'
                ? (c.caCraUrl || c.charityCommissionWebsiteUrl)
                : (c.usIrsUrl || c.charityCommissionWebsiteUrl),
        isThisMuslimCharity: c.isIslamic,
        doTheyPayZakat: c.doesCharityGiveZakat,
        assessmentRequested: c.assessmentRequested,
        annualRevenue: c.annualRevenue ?? null,
        startDate: c.startDate ?? null,
        startYear: c.startYear ?? null,
        isEligible: c.isEligible ?? null,
        ukCharityNumber: c.ukCharityNumber ?? null,
        ukCharityCommissionUrl: c.ukCharityCommissionUrl ?? null,
        caRegistrationNumber: c.caRegistrationNumber ?? null,
        caCraUrl: c.caCraUrl ?? null,
        usEin: c.usEin ?? null,
        usIrsUrl: c.usIrsUrl ?? null,
        ceoName: c.ceoName ?? null,
        submittedByEmail: c.submittedByEmail ?? null,
        assignmentCandidatesByRole,
        totalDuration: c.startDate
            ? `${Math.max(1, Math.floor((Date.now() - new Date(c.startDate).getTime()) / (1000 * 60 * 60 * 24 * 365)))} years`
            : c.startYear
                ? `${Math.max(1, new Date().getFullYear() - Number(c.startYear))} years`
                : undefined,
        reviews: c.reviews,
        verificationSummary: c.verificationSummary,
    }


    return (
        <SingleCharityPageComponent {...charity} />
    )
}


export default CharityDetailsPage
