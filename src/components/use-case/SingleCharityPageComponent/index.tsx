'use client'
import ArrowIcon from '@/components/common/IconComponents/ArrowIcon'
import { TypographyComponent } from '@/components/common/TypographyComponent'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React, { FC, useEffect, useState, useTransition } from 'react'
import { SingleCharityType } from '../CharitiesPageComponent/kanban/KanbanView'
import ThreeDotIcon from '@/components/common/IconComponents/ThreeDotIcon'
import IconDropdownMenuComponent from '@/components/common/IconDropdownMenuComponent'
import EmailIcon from '@/components/common/IconComponents/EmailIcon'
import CardComponent from '@/components/common/CardComponent'
import { TaskIds } from '@/types/audits'

// Extending TaskIds for local modal state management if needed, or ensuring TaskIds includes it.
// Since TaskIds is imported, we can't easily extend it here without changing the type definition in the other file.
// However, the state uses TaskIds | null. 
// A quick fix is to cast the string to any or update the type. 
// checking TaskIds definition might be needed.
// For now, let's just assume we can use a string union for the state.
import ModelComponentWithExternalControl from '@/components/common/ModelComponent/ModelComponentWithExternalControl'
import AssignProjectManager from './models/AssignProjectManager'
import { toast } from 'sonner'
import { capitalizeWords, kebabToTitle } from '@/lib/helpers'
import { useRouteLoader } from '@/components/common/route-loader-provider'
import LinkComponent from '@/components/common/LinkComponent'
import { assignRolesToCharityAction, deleteCharityAction } from '@/app/actions/charities'
import ConfirmActionModal from '@/components/common/ConfirmActionModal'
import { Trash2 } from 'lucide-react'
import ManageTeamModal from './models/ManageTeamModal'
import ConfigureRoleModal from './models/ConfigureRoleModal'
import { usePermissions } from '@/components/common/permissions-provider'
import { PERMISSIONS } from '@/lib/permissions-config'
import EligibilityOverrideModal from './models/EligibilityOverrideModal'
import EligibilityTest from './models/EligibilityTest'
import TabsComponent from '@/components/common/TabsComponent'
import { Progress } from '@/components/ui/progress'
import { AUDIT_DEFINITIONS } from '../SingleAuditPageComponent/AUDIT_DEFINITIONS'
import { BadgeCheck, CalendarDays, CheckCircle2, CircleDashed, Globe, Mail, MapPin, UserCircle2, UserCheck, XCircle } from 'lucide-react'

type Member = SingleCharityType['members'][0]
type IProps = SingleCharityType;

type ModelControl = {
    nameOfModel: null | TaskIds | 'manage-team' | 'configure-role' | 'eligibility-override' | 'eligibility-test' | 'assign-finance-auditor' | 'assign-zakat-auditor';
}

const InfoRow: FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => {
    return (
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
            <TypographyComponent variant='body2' className="w-full sm:w-[180px] text-[#666E76] sm:flex-none">
                {label}
            </TypographyComponent>
            <div className="flex-1">
                {typeof value === 'string' || typeof value === 'number' ? (
                    <TypographyComponent variant='body2' className="text-[#101928] font-medium">
                        {value}
                    </TypographyComponent>
                ) : (
                    value
                )}
            </div>
        </div>
    )
}

const ProgressStepRow: FC<{
    title: string
    done: boolean
    pendingText?: string
    successText?: string
    meta?: string
}> = ({ title, done, pendingText = 'Pending', successText = 'Done', meta }) => {
    return (
        <div className="flex items-start justify-between gap-3 rounded-lg border border-[#EEF2F6] bg-white p-3">
            <div className="flex items-start gap-2">
                {done ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-600" />
                ) : (
                    <CircleDashed className="mt-0.5 h-4 w-4 text-[#98A2B3]" />
                )}
                <div className="flex flex-col">
                    <TypographyComponent variant='body2' className="font-medium text-[#101928]">
                        {title}
                    </TypographyComponent>
                    {meta ? (
                        <TypographyComponent variant='caption' className="text-[#667085]">
                            {meta}
                        </TypographyComponent>
                    ) : null}
                </div>
            </div>
            <TypographyComponent variant='caption' className={done ? 'text-green-600 font-medium' : 'text-[#667085]'}>
                {done ? successText : pendingText}
            </TypographyComponent>
        </div>
    )
}

const SingleCharityPageComponent: FC<IProps> = ({
    charityDesc,
    charityOwnerName,
    charityTitle,
    id: charityId,
    members,
    status,
    country,
    category,
    totalDuration,
    website,
    isThisMuslimCharity,
    doTheyPayZakat,
    verificationSummary,
    assessmentRequested,
    annualRevenue,
    startDate,
    startYear,
    ukCharityNumber,
    ukCharityCommissionUrl,
    caRegistrationNumber,
    caCraUrl,
    usEin,
    usIrsUrl,
    ceoName,
    reviews,
    submittedByEmail,
    assignmentCandidatesByRole,
}) => {
    const router = useRouter();
    const [modelState, setModelState] = useState<ModelControl>({ nameOfModel: null });
    const { startNavigation } = useRouteLoader()
    const [isBackPending, startBackTransition] = useTransition()
    const [isTaskPending, startTaskTransition] = useTransition()
    const [pendingTaskId, setPendingTaskId] = useState<TaskIds | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedMemberForRoleEdit, setSelectedMemberForRoleEdit] = useState<Member | null>(null)
    const [auditTab, setAuditTab] = useState<'completed' | 'pending'>('pending')
    const { isAllowed } = usePermissions()
    const projectManagerCandidates = assignmentCandidatesByRole?.projectManager ?? []
    const financeAuditorCandidates = assignmentCandidatesByRole?.financeAuditor ?? []
    const zakatAuditorCandidates = assignmentCandidatesByRole?.zakatAuditor ?? []

    const resolveCountry = (value?: string) => {
        if (!value) return 'united-states'
        const cLower = value.toLowerCase()
        if (cLower === 'uk' || cLower === 'united kingdom' || cLower === 'united-kingdom') {
            return 'united-kingdom'
        }
        if (cLower === 'ca' || cLower === 'canada') {
            return 'canada'
        }
        if (cLower === 'usa' || cLower === 'us' || cLower === 'united states' || cLower === 'united-states') {
            return 'united-states'
        }
        return 'united-states'
    }

    const resolvedCountry = resolveCountry(country)

    const handleOpenModel = (nameOfModel: TaskIds | 'manage-team' | 'configure-role' | 'eligibility-override' | 'eligibility-test' | 'assign-finance-auditor' | 'assign-zakat-auditor') => {
        setModelState(prevState => ({ ...prevState, nameOfModel }));
    }

    const handleCloseModel = () => {
        setModelState({ nameOfModel: null });
    }

    useEffect(() => {
        if (!isTaskPending) {
            setPendingTaskId(null)
        }
    }, [isTaskPending])

    const modalTaskIds: TaskIds[] = ['assign-project-manager']

    const handleTask = (taskId: TaskIds) => {
        if (modalTaskIds.includes(taskId)) {
            handleOpenModel(taskId)
            return
        }
        setPendingTaskId(taskId)
        startNavigation()
        startTaskTransition(() => router.push(`/charities/${charityId}/audits/${taskId}?country=${resolvedCountry}`))
    }

    const canAssignPM = isAllowed({ anyOf: [PERMISSIONS.ASSIGN_PM_CHARITY] })
    const canViewEmailLogs = isAllowed({ anyOf: [PERMISSIONS.SEND_EMAIL_CHARITY_OWNER] })
    const canDeleteCharity = isAllowed({ anyOf: [PERMISSIONS.DELETE_CHARITY] })
    const canSubmitAudit = isAllowed({
        anyOf: [PERMISSIONS.AUDIT_SUBMISSION_CREATE, PERMISSIONS.AUDIT_SUBMISSION_COMPLETE],
    })
    const canManageCharity = isAllowed({ anyOf: [PERMISSIONS.CHARITY_MANAGE] })

    const roleSlots = [
        { slug: 'project-manager', label: 'Project Manager' },
        { slug: 'finance-auditor', label: 'Finance Auditor' },
        { slug: 'zakat-auditor', label: 'Zakat Auditor' },
        { slug: 'admin', label: 'Admin' },
    ]

    const membersByRole = roleSlots.map(slot => {
        const names = members
            .filter(m => m.role === slot.slug)
            .map(m => m.name)
        return {
            ...slot,
            names
        }
    })
    const projectManagerAssigned = membersByRole.find(m => m.slug === 'project-manager')?.names.length
        ? true
        : Boolean(verificationSummary?.projectManagerAssigned)
    const financeAuditorAssigned = (membersByRole.find(m => m.slug === 'finance-auditor')?.names.length ?? 0) > 0
    const zakatAuditorAssigned = (membersByRole.find(m => m.slug === 'zakat-auditor')?.names.length ?? 0) > 0

    const auditsCompleted = verificationSummary?.audits?.completed ?? reviews?.summary?.completed ?? 0
    const auditsTotal = verificationSummary?.audits?.total ?? reviews?.summary?.total ?? 4
    const auditProgress = auditsTotal > 0 ? Math.round((auditsCompleted / auditsTotal) * 100) : 0

    const eligibilityLabel = verificationSummary?.eligibility?.pending
        ? 'Pending'
        : verificationSummary?.eligibility?.result === 'eligible'
            ? 'Eligible'
            : verificationSummary?.eligibility?.result === 'ineligible'
                ? 'Ineligible'
                : 'Pending'
    const isEligibilityDone = !verificationSummary?.eligibility?.pending
    const shouldHideAuditAndProgress = status === 'ineligible' || verificationSummary?.eligibility?.pending
    const isAdminReviewed = status === 'pending-admin-review' || status === 'approved'
    const passFailValue = status === 'approved'
        ? 'Pass'
        : status === 'ineligible'
            ? 'Fail'
            : 'Pending'
    const isPassFailDone = passFailValue !== 'Pending'
    const projectManagerName = members.find(m => m.role === 'project-manager')?.name || 'Unassigned'

    const formatStableDate = (value?: string | null) => {
        if (!value) return '-'
        const isoPart = value.includes('T') ? value.split('T')[0] : value
        const [yyyy, mm, dd] = isoPart.split('-')
        if (!yyyy || !mm || !dd) return value
        return `${dd}/${mm}/${yyyy}`
    }

    const auditStatusLabel = (status?: string) => {
        if (!status) return 'Pending'
        const normalized = status.replace('_', '-')
        const labels: Record<string, string> = {
            pending: 'Pending',
            'in-progress': 'In Progress',
            in_progress: 'In Progress',
            draft: 'Draft',
            submitted: 'Submitted',
            completed: 'Completed',
        }
        return labels[normalized] || kebabToTitle(normalized)
    }

    const auditMeta = [
        { id: 'core-area-1', statusKey: 'coreArea1', reviewKey: 'core1' },
        { id: 'core-area-2', statusKey: 'coreArea2', reviewKey: 'core2' },
        { id: 'core-area-3', statusKey: 'coreArea3', reviewKey: 'core3' },
        { id: 'core-area-4', statusKey: 'coreArea4', reviewKey: 'core4' },
    ] as const

    const getReview = (key: typeof auditMeta[number]['reviewKey']) => {
        return reviews ? (reviews as any)[key] : undefined
    }

    const getAuditStatus = (key: typeof auditMeta[number]['statusKey'], reviewKey: typeof auditMeta[number]['reviewKey']) => {
        return getReview(reviewKey)?.status ?? (verificationSummary?.audits as any)?.[key]
    }

    const isAuditComplete = (status?: string) => {
        return status === 'completed' || status === 'submitted'
    }

    const completedAudits = auditMeta.filter(item => isAuditComplete(getAuditStatus(item.statusKey, item.reviewKey)))
    const pendingAudits = auditMeta.filter(item => !isAuditComplete(getAuditStatus(item.statusKey, item.reviewKey)))

    const getAssignedNamesForAudit = (auditId: typeof auditMeta[number]['id']) => {
        const roleByAudit: Record<typeof auditMeta[number]['id'], 'project-manager' | 'finance-auditor' | 'zakat-auditor'> = {
            'core-area-1': 'project-manager',
            'core-area-2': 'finance-auditor',
            'core-area-3': 'zakat-auditor',
            'core-area-4': 'project-manager',
        }
        const role = roleByAudit[auditId]
        const names = membersByRole.find(m => m.slug === role)?.names ?? []
        return names.length ? names.join(', ') : 'Unassigned'
    }

    const assignSingleRole = async (userId: string, roleSlug: 'project-manager' | 'finance-auditor' | 'zakat-auditor') => {
        try {
            const res = await assignRolesToCharityAction(charityId, [{
                userId,
                add: [roleSlug],
                remove: []
            }])

            if (res.ok) {
                const labels = {
                    'project-manager': 'Project manager',
                    'finance-auditor': 'Financial auditor',
                    'zakat-auditor': 'Zakat auditor',
                } as const
                toast.success(`${labels[roleSlug]} assigned successfully`)
                handleCloseModel()
                router.refresh()
            } else {
                toast.error(res.message || `Failed to assign ${roleSlug}`)
            }
        } catch (error) {
            console.error(error)
            toast.error("An unexpected error occurred")
        }
    }

    const dropdownOptions = [
        canViewEmailLogs
            ? {
                value: 'view-email-logs',
                label: <div className='flex gap-1 items-center cursor-pointer' onClick={() => router.push(`/email-logs?charity=${encodeURIComponent(charityTitle)}`)}><EmailIcon color='#666E76' /><span>View Email Logs</span></div>
            }
            : null,
        canDeleteCharity
            ? {
                value: 'delete-charity',
                label: <div className='flex gap-1 items-center text-red-600 cursor-pointer' onClick={() => setShowDeleteModal(true)}>
                    <Trash2 className="h-4 w-4" /><span>Delete Charity</span>
                </div>
            }
            : null,
    ].filter(Boolean) as { value: string; label: React.ReactNode }[];

    return (
        <div className="flex flex-col gap-5">
            <div>
                <Button
                    onClick={() => {
                        startNavigation()
                        startBackTransition(() => router.push('/charities'))
                    }}
                    variant="secondary"
                    className="border-0 text-primary"
                    loading={isBackPending}
                >
                    <ArrowIcon />
                    Back to All Charities
                </Button>
            </div>
            <div className="flex flex-col gap-6">
                <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                    <CardComponent className="w-full border-[#D9E4F2] bg-gradient-to-b from-[#F8FCFF] to-white">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex flex-col gap-1">
                                <TypographyComponent variant='h1'>{charityTitle}</TypographyComponent>
                                <TypographyComponent variant='body2' className="text-[#5A6472]">
                                    Submitted by {charityOwnerName}
                                </TypographyComponent>
                            </div>
                            <IconDropdownMenuComponent
                                className='rounded-full border-[#E6E6E6] shadow-none border bg-white'
                                icon={<ThreeDotIcon />}
                                options={dropdownOptions}
                            />
                        </div>
                        <div className="mt-5 grid gap-4 md:grid-cols-2">
                            <div className="rounded-lg border border-[#E7EEF8] bg-white p-3">
                                <div className="mb-1 flex items-center gap-2 text-[#5A6472]">
                                    <MapPin className="h-4 w-4" />
                                    <TypographyComponent variant='caption'>Registered Country</TypographyComponent>
                                </div>
                                <TypographyComponent variant='body2' className="font-semibold text-[#101928]">
                                    {country ? kebabToTitle(country) : '-'}
                                </TypographyComponent>
                            </div>
                            <div className="rounded-lg border border-[#E7EEF8] bg-white p-3">
                                <div className="mb-1 flex items-center gap-2 text-[#5A6472]">
                                    <UserCheck className="h-4 w-4" />
                                    <TypographyComponent variant='caption'>Project Manager</TypographyComponent>
                                </div>
                                <TypographyComponent variant='body2' className="font-semibold text-[#101928]">
                                    {projectManagerName}
                                </TypographyComponent>
                            </div>
                            <div className="rounded-lg border border-[#E7EEF8] bg-white p-3">
                                <div className="mb-1 flex items-center gap-2 text-[#5A6472]">
                                    <UserCircle2 className="h-4 w-4" />
                                    <TypographyComponent variant='caption'>CEO</TypographyComponent>
                                </div>
                                <TypographyComponent variant='body2' className="font-semibold text-[#101928]">
                                    {ceoName || '-'}
                                </TypographyComponent>
                            </div>
                            <div className="rounded-lg border border-[#E7EEF8] bg-white p-3">
                                <div className="mb-1 flex items-center gap-2 text-[#5A6472]">
                                    <CalendarDays className="h-4 w-4" />
                                    <TypographyComponent variant='caption'>Total Duration</TypographyComponent>
                                </div>
                                <TypographyComponent variant='body2' className="font-semibold text-[#101928]">
                                    {totalDuration || '-'}
                                </TypographyComponent>
                            </div>
                        </div>
                        <div className="mt-4 flex flex-col gap-2">
                            {submittedByEmail ? (
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-[#667085]" />
                                    <TypographyComponent variant='body2' className="text-[#101928]">
                                        {submittedByEmail}
                                    </TypographyComponent>
                                </div>
                            ) : null}
                            {website ? (
                                <div className="flex items-center gap-2">
                                    <Globe className="h-4 w-4 text-[#667085]" />
                                    <a href={website.startsWith('http') ? website : `https://${website}`} target='_blank' className='text-blue-600 underline text-sm font-medium'>
                                        Visit website
                                    </a>
                                </div>
                            ) : null}
                        </div>
                        {charityDesc ? (
                            <TypographyComponent className="mt-4 text-[#475467]">{charityDesc}</TypographyComponent>
                        ) : null}
                    </CardComponent>
                    {!shouldHideAuditAndProgress ? (
                        <CardComponent heading="Progress Overview" className="border-[#D9E4F2] bg-gradient-to-b from-[#F8FCFF] to-white">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <TypographyComponent variant='body2' className="font-medium text-[#101928]">
                                        Perform Assessments
                                    </TypographyComponent>
                                    <TypographyComponent variant='body2' className="font-semibold text-[#101928]">
                                        {auditsCompleted}/{auditsTotal}
                                    </TypographyComponent>
                                </div>
                                <Progress value={auditProgress} className="h-2.5" />
                                <div className="mt-1 flex flex-col gap-2">
                                    <ProgressStepRow
                                        title="Perform Eligibility"
                                        done={isEligibilityDone}
                                        successText={eligibilityLabel}
                                        pendingText="Pending"
                                    />
                                    <ProgressStepRow
                                        title="Assigned to PM"
                                        done={projectManagerAssigned}
                                        successText="Assigned"
                                        pendingText="Unassigned"
                                        meta={projectManagerAssigned ? projectManagerName : undefined}
                                    />
                                    <ProgressStepRow
                                        title="Perform Assessments"
                                        done={auditsCompleted === auditsTotal}
                                        successText="Completed"
                                        pendingText="In Progress"
                                        meta={`${auditsCompleted}/${auditsTotal}`}
                                    />
                                    <ProgressStepRow
                                        title="Reviewed by Admin"
                                        done={isAdminReviewed}
                                        successText="Reviewed"
                                        pendingText="Pending"
                                    />
                                    <div className="flex items-center justify-between rounded-lg border border-[#EEF2F6] bg-white p-3">
                                        <div className="flex items-center gap-2">
                                            {passFailValue === 'Pass' ? (
                                                <BadgeCheck className="h-4 w-4 text-green-600" />
                                            ) : passFailValue === 'Fail' ? (
                                                <XCircle className="h-4 w-4 text-red-600" />
                                            ) : (
                                                <CircleDashed className="h-4 w-4 text-[#98A2B3]" />
                                            )}
                                            <TypographyComponent variant='body2' className="font-medium text-[#101928]">
                                                Pass / Fail
                                            </TypographyComponent>
                                        </div>
                                        <TypographyComponent variant='caption' className={isPassFailDone ? 'font-medium text-[#101928]' : 'text-[#667085]'}>
                                            {passFailValue}
                                        </TypographyComponent>
                                    </div>
                                </div>
                            </div>
                        </CardComponent>
                    ) : null}
                </div>
                <div className="grid gap-6 xl:grid-cols-2">
                    <CardComponent heading="Eligibility Details">
                        <div className="flex flex-col gap-3">
                            {status === 'pending-eligibility' && canManageCharity ? (
                                <Button
                                    variant="outline"
                                    type="button"
                                    className="w-full"
                                    onClick={() => handleOpenModel('eligibility-test')}
                                >
                                    Perform Eligibility
                                </Button>
                            ) : null}
                            {status === 'ineligible' && canManageCharity ? (
                                <Button
                                    variant="outline"
                                    type="button"
                                    className="w-full"
                                    onClick={() => handleOpenModel('eligibility-override')}
                                >
                                    Override Eligibility
                                </Button>
                            ) : null}
                            <InfoRow label="Category:" value={category ? kebabToTitle(category) : '-'} />
                            <InfoRow label="Start Date:" value={startDate ? formatStableDate(startDate) : '-'} />
                            {!startDate ? <InfoRow label="Start Year:" value={startYear ?? '-'} /> : null}
                            <InfoRow label="Assessment Requested:" value={assessmentRequested ? 'Yes' : 'No'} />
                            <InfoRow label="Annual Revenue:" value={typeof annualRevenue === 'number' ? annualRevenue.toLocaleString() : '-'} />
                            <InfoRow label="Muslim Charity:" value={isThisMuslimCharity ? 'Yes' : 'No'} />
                            <InfoRow label="Pays Zakat:" value={doTheyPayZakat ? 'Yes' : 'No'} />
                        </div>
                    </CardComponent>
                    <CardComponent heading="Registration">
                        <div className="flex flex-col gap-3">
                            <InfoRow
                                label="Registration Status:"
                                value={
                                    (resolvedCountry === 'united-kingdom' && ukCharityNumber)
                                        || (resolvedCountry === 'canada' && caRegistrationNumber)
                                        || (resolvedCountry === 'united-states' && usEin)
                                        ? 'Registered'
                                        : 'Not registered'
                                }
                            />
                            {resolvedCountry === 'united-kingdom' ? (
                                <>
                                    <InfoRow label="Charity No:" value={ukCharityNumber || '-'} />
                                    <InfoRow
                                        label="Charity Commission:"
                                        value={
                                            ukCharityCommissionUrl
                                                ? <a href={ukCharityCommissionUrl} target="_blank" className="text-blue-600 underline text-sm font-medium">View profile</a>
                                                : '-'
                                        }
                                    />
                                </>
                            ) : null}
                            {resolvedCountry === 'canada' ? (
                                <>
                                    <InfoRow label="Registration No:" value={caRegistrationNumber || '-'} />
                                    <InfoRow
                                        label="CRA Details:"
                                        value={
                                            caCraUrl
                                                ? <a href={caCraUrl} target="_blank" className="text-blue-600 underline text-sm font-medium">View profile</a>
                                                : '-'
                                        }
                                    />
                                </>
                            ) : null}
                            {resolvedCountry === 'united-states' ? (
                                <>
                                    <InfoRow label="EIN:" value={usEin || '-'} />
                                    <InfoRow
                                        label="IRS Link:"
                                        value={
                                            usIrsUrl
                                                ? <a href={usIrsUrl} target="_blank" className="text-blue-600 underline text-sm font-medium">View profile</a>
                                                : <span className="text-[#98A2B3]">Not available</span>
                                        }
                                    />
                                </>
                            ) : null}
                        </div>
                    </CardComponent>
                </div>
                {!shouldHideAuditAndProgress ? (
                    <CardComponent heading="Audit Summary">
                        <TabsComponent
                            value={auditTab}
                            onValueChange={(value) => setAuditTab(value as 'completed' | 'pending')}
                            items={[
                                {
                                    value: 'completed',
                                    label: `Completed (${completedAudits.length})`,
                                    content: (
                                        <div className="flex flex-col gap-3 pt-3">
                                            {completedAudits.length === 0 ? (
                                                <TypographyComponent variant="body2" className="text-[#666E76]">
                                                    No completed assessments yet.
                                                </TypographyComponent>
                                            ) : (
                                                completedAudits.map(item => {
                                                    const review = getReview(item.reviewKey)
                                                    const status = getAuditStatus(item.statusKey, item.reviewKey)
                                                    const score = review?.score
                                                    const total = review?.totalScore
                                                    const percent = typeof score === 'number' && typeof total === 'number' && total > 0
                                                        ? Math.round((score / total) * 100)
                                                        : null
                                                    return (
                                                        <div key={item.id} className="flex flex-col gap-2 rounded-md border border-[#EFF2F6] p-3 sm:flex-row sm:items-center sm:justify-between">
                                                            <div className="flex flex-col gap-1">
                                                                <TypographyComponent variant="body2" className="font-medium text-[#101928]">
                                                                    {AUDIT_DEFINITIONS[item.id].title}
                                                                </TypographyComponent>
                                                                <TypographyComponent variant="caption" className="text-[#666E76]">
                                                                    Assigned to: {getAssignedNamesForAudit(item.id)}
                                                                </TypographyComponent>
                                                                <TypographyComponent variant="caption" className="text-[#666E76]">
                                                                    Status: {auditStatusLabel(status)}
                                                                </TypographyComponent>
                                                                {percent !== null ? (
                                                                    <TypographyComponent variant="caption" className="text-[#666E76]">
                                                                        Score: {percent}%
                                                                    </TypographyComponent>
                                                                ) : null}
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <LinkComponent to={`/charities/${charityId}/audits`}>
                                                                    <Button variant="outline">View</Button>
                                                                </LinkComponent>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            )}
                                        </div>
                                    )
                                },
                                {
                                    value: 'pending',
                                    label: `Pending (${pendingAudits.length})`,
                                    content: (
                                        <div className="flex flex-col gap-3 pt-3">
                                            {pendingAudits.length === 0 ? (
                                                <TypographyComponent variant="body2" className="text-[#666E76]">
                                                    No pending assessments.
                                                </TypographyComponent>
                                            ) : (
                                                pendingAudits.map(item => {
                                                    const status = getAuditStatus(item.statusKey, item.reviewKey)
                                                    const isCore1Or4 = item.id === 'core-area-1' || item.id === 'core-area-4'
                                                    const needsProjectManager = isCore1Or4 && !projectManagerAssigned
                                                    const needsFinanceAuditor = item.id === 'core-area-2' && !financeAuditorAssigned
                                                    const needsZakatAuditor = item.id === 'core-area-3' && !zakatAuditorAssigned
                                                    const assignmentAction = needsProjectManager
                                                        ? {
                                                            label: 'Assign Project Manager',
                                                            onClick: () => handleOpenModel('assign-project-manager'),
                                                            disabled: !canAssignPM
                                                        }
                                                        : needsFinanceAuditor
                                                            ? {
                                                                label: 'Assign Financial Auditor',
                                                                onClick: () => handleOpenModel('assign-finance-auditor'),
                                                                disabled: !canAssignPM
                                                            }
                                                            : needsZakatAuditor
                                                                ? {
                                                                    label: 'Add Zakat Auditor',
                                                                    onClick: () => handleOpenModel('assign-zakat-auditor'),
                                                                    disabled: !canAssignPM
                                                                }
                                                                : null
                                                    return (
                                                        <div key={item.id} className="flex flex-col gap-2 rounded-md border border-[#EFF2F6] p-3 sm:flex-row sm:items-center sm:justify-between">
                                                            <div className="flex flex-col gap-1">
                                                                <TypographyComponent variant="body2" className="font-medium text-[#101928]">
                                                                    {AUDIT_DEFINITIONS[item.id].title}
                                                                </TypographyComponent>
                                                                <TypographyComponent variant="caption" className="text-[#666E76]">
                                                                    Assigned to: {getAssignedNamesForAudit(item.id)}
                                                                </TypographyComponent>
                                                                <TypographyComponent variant="caption" className="text-[#666E76]">
                                                                    Status: {auditStatusLabel(status)}
                                                                </TypographyComponent>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                {assignmentAction ? (
                                                                    <Button
                                                                        variant="outline"
                                                                        onClick={assignmentAction.onClick}
                                                                        disabled={assignmentAction.disabled}
                                                                    >
                                                                        {assignmentAction.label}
                                                                    </Button>
                                                                ) : (
                                                                    <Button
                                                                        variant="outline"
                                                                        onClick={() => handleTask(item.id as TaskIds)}
                                                                        disabled={!canSubmitAudit || (pendingTaskId === item.id && isTaskPending)}
                                                                    >
                                                                        Start
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            )}
                                        </div>
                                    )
                                }
                            ]}
                        />
                    </CardComponent>
                ) : null}
            </div>
            <ModelComponentWithExternalControl title="Assign Project Manager"
                onOpenChange={handleCloseModel}
                open={modelState.nameOfModel === 'assign-project-manager'}
            >
                {canAssignPM ? (
                    <AssignProjectManager onSelection={async (userId) => {
                        await assignSingleRole(userId, 'project-manager')
                    }} users={projectManagerCandidates} onCancel={() => {
                        handleCloseModel()
                    }} />
                ) : null}
            </ModelComponentWithExternalControl>

            <ModelComponentWithExternalControl
                title="Assign Financial Auditor"
                onOpenChange={handleCloseModel}
                open={modelState.nameOfModel === 'assign-finance-auditor'}
            >
                {canAssignPM ? (
                    <AssignProjectManager
                        roleLabel="financial auditor"
                        actionLabel="Assign Financial Auditor"
                        users={financeAuditorCandidates}
                        onSelection={async (userId) => {
                            await assignSingleRole(userId, 'finance-auditor')
                        }}
                        onCancel={handleCloseModel}
                    />
                ) : null}
            </ModelComponentWithExternalControl>

            <ModelComponentWithExternalControl
                title="Add Zakat Auditor"
                onOpenChange={handleCloseModel}
                open={modelState.nameOfModel === 'assign-zakat-auditor'}
            >
                {canAssignPM ? (
                    <AssignProjectManager
                        roleLabel="zakat auditor"
                        actionLabel="Add Zakat Auditor"
                        users={zakatAuditorCandidates}
                        onSelection={async (userId) => {
                            await assignSingleRole(userId, 'zakat-auditor')
                        }}
                        onCancel={handleCloseModel}
                    />
                ) : null}
            </ModelComponentWithExternalControl>


            <ModelComponentWithExternalControl
                title="Override Eligibility"
                onOpenChange={handleCloseModel}
                open={modelState.nameOfModel === 'eligibility-override'}
            >
                {status === 'ineligible' && canManageCharity ? (
                    <EligibilityOverrideModal
                        charityId={charityId}
                        charityTitle={charityTitle}
                        suggestionInput={{
                            annualRevenue: annualRevenue ?? null,
                            isIslamic: Boolean(isThisMuslimCharity),
                            category,
                            assessmentRequested: Boolean(assessmentRequested),
                            startDate: startDate ?? null,
                            startYear: startYear ?? null,
                        }}
                        onCancel={handleCloseModel}
                        onUpdated={() => {
                            handleCloseModel()
                            router.refresh()
                        }}
                    />
                ) : null}
            </ModelComponentWithExternalControl>

            <ModelComponentWithExternalControl
                title="Perform Eligibility"
                onOpenChange={handleCloseModel}
                open={modelState.nameOfModel === 'eligibility-test'}
            >
                {status === 'pending-eligibility' && canManageCharity ? (
                    <EligibilityTest
                        charityId={charityId}
                        charityTitle={charityTitle}
                        suggestionInput={{
                            annualRevenue: annualRevenue ?? null,
                            isIslamic: Boolean(isThisMuslimCharity),
                            category,
                            assessmentRequested: Boolean(assessmentRequested),
                            startDate: startDate ?? null,
                            startYear: startYear ?? null,
                        }}
                        onCancel={handleCloseModel}
                        onUpdated={() => {
                            handleCloseModel()
                            router.refresh()
                        }}
                    />
                ) : null}
            </ModelComponentWithExternalControl>

            <ModelComponentWithExternalControl
                title="Manage Team Members"
                onOpenChange={handleCloseModel}
                open={modelState.nameOfModel === 'manage-team'}
                dialogContentClassName='md:min-w-[800px]'
            >
                {canAssignPM ? (
                    <ManageTeamModal
                        members={members}
                        onCancel={handleCloseModel}
                        onUpdate={() => {
                            handleCloseModel()
                            // In a real app we would call an API here
                            toast.success('Team updated successfully')
                        }}
                        onEdit={(member) => {
                            setSelectedMemberForRoleEdit(member)
                            handleOpenModel('configure-role')
                        }}
                    />
                ) : null}
            </ModelComponentWithExternalControl>

            <ModelComponentWithExternalControl
                title="Configure Role"
                onOpenChange={(open) => {
                    if (!open) {
                        handleOpenModel('manage-team') // Go back to manage team if closing via dialog close
                    }
                }}
                open={modelState.nameOfModel === 'configure-role'}
                dialogContentClassName='sm:max-w-[425px]'
            >
                {selectedMemberForRoleEdit && canAssignPM && (
                    <ConfigureRoleModal
                        member={selectedMemberForRoleEdit}
                        onCancel={() => handleOpenModel('manage-team')}
                        onUpdate={(newRole) => {
                            // Here we would typically update the state or call an API
                            console.log(`Updated role for ${selectedMemberForRoleEdit.name} to ${newRole}`)
                            toast.success(`Role updated to ${newRole}`)
                            handleOpenModel('manage-team')
                        }}
                    />
                )}
            </ModelComponentWithExternalControl>

            <ConfirmActionModal
                open={showDeleteModal}
                onOpenChange={setShowDeleteModal}
                title="Delete Charity"
                description={`Are you sure you want to delete ${capitalizeWords(charityTitle)}? This action cannot be undone.`}
                confirmText={isDeleting ? "Deleting..." : "Delete Charity"}
                onConfirm={async () => {
                    if (!canDeleteCharity) return;
                    setIsDeleting(true)
                    try {
                        const res = await deleteCharityAction(charityId)
                        if (res.ok) {
                            toast.success("Charity deleted successfully")
                            router.push('/charities')
                        } else {
                            toast.error(res.message || "Failed to delete charity")
                        }
                    } catch (error) {
                        console.error(error)
                        toast.error("An error occurred while deleting charity")
                    } finally {
                        setIsDeleting(false)
                    }
                }}
            />
        </div>
    )
}

export default SingleCharityPageComponent
