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
import MultipleUsersIcon from '@/components/common/IconComponents/MultipleUsersIcon'
import AuditStatus from '@/components/common/IconComponents/AuditStatus'
import SingleCharityDetails from './SingleCharityDetails'
import { AUDIT_TASKS } from '@/lib/constants'
import { TaskIds } from '@/types/audits'

// Extending TaskIds for local modal state management if needed, or ensuring TaskIds includes it.
// Since TaskIds is imported, we can't easily extend it here without changing the type definition in the other file.
// However, the state uses TaskIds | null. 
// A quick fix is to cast the string to any or update the type. 
// checking TaskIds definition might be needed.
// For now, let's just assume we can use a string union for the state.
import SendIcon from './icons/SendIcon'
import ModelComponentWithExternalControl from '@/components/common/ModelComponent/ModelComponentWithExternalControl'
import AssignProjectManager from './models/AssignProjectManager'
import EligibilityTest from './models/EligibilityTest'
import { toast } from 'sonner'
import { capitalizeWords } from '@/lib/helpers'
import { useRouteLoader } from '@/components/common/route-loader-provider'
import LinkComponent from '@/components/common/LinkComponent'
import { assignRolesToCharityAction, deleteCharityAction } from '@/app/actions/charities'
import ConfirmActionModal from '@/components/common/ConfirmActionModal'
import { Trash2 } from 'lucide-react'
import ManageTeamModal from './models/ManageTeamModal'
import ConfigureRoleModal from './models/ConfigureRoleModal'
import { usePermissions } from '@/components/common/permissions-provider'
import { PERMISSIONS } from '@/lib/permissions-config'

type Member = SingleCharityType['members'][0]
type IProps = SingleCharityType;

type ModelControl = {
    nameOfModel: null | TaskIds | 'manage-team' | 'configure-role';
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
    const { isAllowed } = usePermissions()

    const handleOpenModel = (nameOfModel: TaskIds | 'manage-team' | 'configure-role') => {
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

    const modalTaskIds: TaskIds[] = ['assign-project-manager', 'eligibility']

    const handleTask = (taskId: TaskIds) => {
        let resolvedCountry = 'usa';
        if (country) {
            const cLower = country.toLowerCase();
            if (cLower === 'uk' || cLower === 'united kingdom') resolvedCountry = 'uk';
            else if (cLower === 'ca' || cLower === 'canada') resolvedCountry = 'ca';
            // Default stays 'usa' or if explicitly 'usa'/'united states'
        }

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
    const canViewAuditSummary = isAllowed({
        anyOf: [PERMISSIONS.AUDIT_CHARITY_SUMMARY_VIEW, PERMISSIONS.AUDIT_CHARITY_VIEW],
    })
    const canDeleteCharity = isAllowed({ anyOf: [PERMISSIONS.DELETE_CHARITY] })
    const canSubmitAudit = isAllowed({
        anyOf: [PERMISSIONS.AUDIT_SUBMISSION_CREATE, PERMISSIONS.AUDIT_SUBMISSION_COMPLETE],
    })

    const visibleTasks = AUDIT_TASKS.filter(({ id: taskId }) => {
        if (taskId === "assign-project-manager") {
            return canAssignPM && !verificationSummary?.projectManagerAssigned;
        }

        // Hide eligibility and core area audits if project manager is not assigned
        if (!verificationSummary?.projectManagerAssigned) {
            if (taskId === "eligibility" || taskId.startsWith('core-area')) {
                return false;
            }
        }

        if (taskId === "eligibility") {
            return canSubmitAudit && verificationSummary?.eligibility.pending;
        }

        if (taskId.startsWith('core-area')) {
            // Convert kebab-case (core-area-1) to camelCase (coreArea1) to match API response
            const auditKey = taskId.replace(/-([a-z0-9])/g, (g) => g[1].toUpperCase());
            // Check if the audit key exists in verificationSummary.audits and if it is 'pending'
            // Check if the audit key exists in verificationSummary.audits and if it is not 'completed'
            // User requested: "in progress will also show only completed will not show"
            type AuditKey = keyof NonNullable<typeof verificationSummary>['audits'];
            const status = verificationSummary?.audits?.[auditKey as AuditKey];
            return canSubmitAudit && status !== 'completed';
        }

        return canSubmitAudit;
    })

    const dropdownOptions = [
        canAssignPM
            ? {
                value: 'manage-team',
                label: <div className='flex gap-1 items-center cursor-pointer' onClick={() => handleOpenModel('manage-team')}>
                    <MultipleUsersIcon /><span>Manage Team</span>
                </div>
            }
            : null,
        canViewEmailLogs
            ? {
                value: 'view-email-logs',
                label: <div className='flex gap-1 items-center cursor-pointer' onClick={() => router.push(`/email-logs?charity=${encodeURIComponent(charityTitle)}`)}><EmailIcon color='#666E76' /><span>View Email Logs</span></div>
            }
            : null,
        canViewAuditSummary
            ? {
                value: 'view-audit-status',
                label: <LinkComponent to={`/charities/${charityId}/audits`}><div className='flex gap-1 items-center cursor-pointer'><AuditStatus /><span>View Audit Status</span></div></LinkComponent>
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
                {/* top - left side: charity info, right side: other info */}
                <div className="flex flex-col gap-6 xl:flex-row xl:gap-[77px]">
                    <div className="w-full xl:w-[675px] flex flex-col gap-4 items-start">
                        <TypographyComponent variant='h1' className="">{charityTitle}</TypographyComponent>
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
                                <TypographyComponent variant='body2' className="w-32 sm:w-[178px] text-[#666E76]">
                                    Owner&apos;s Name:
                                </TypographyComponent>
                                <TypographyComponent variant='body2' className="text-[#101928] font-medium">
                                    {charityOwnerName}
                                </TypographyComponent>
                            </div>
                            {members.find(m => m.role === 'project-manager') ? (
                                <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
                                    <TypographyComponent variant='body2' className="w-32 sm:w-[178px] text-[#666E76]">Project Manager&apos;s Name:</TypographyComponent>
                                    <TypographyComponent variant='body2' className="text-[#101928] font-medium">
                                        {members.find(m => m.role === 'project-manager')?.name}
                                    </TypographyComponent>
                                </div>
                            ) : null}
                        </div>
                        <TypographyComponent>{charityDesc}</TypographyComponent>
                    </div>
                    <div className="flex flex-col gap-4 grow">
                        <div className="flex relative justify-center">
                            <TypographyComponent variant='h2' className='w-full'>Charity Information</TypographyComponent>
                            <IconDropdownMenuComponent
                                className='rotate-90 rounded-full border-[#E6E6E6] shadow-none border'
                                icon={<ThreeDotIcon />}
                                options={dropdownOptions}
                            />
                        </div>
                        <SingleCharityDetails
                            {...{
                                status,
                                category,
                                country,
                                totalDuration,
                                website,
                                isThisMuslimCharity,
                                doTheyPayZakat,
                                members
                            }}
                        />
                    </div>
                </div>
                {/* bottom - pending actions */}
                <div className="flex flex-col gap-4 mb-4">
                    <TypographyComponent variant='h2'>Pending Actions</TypographyComponent>
                    <div className='h-[1px] w-full bg-[rgba(178,178,178,0.4)]'>&nbsp;</div>
                    {visibleTasks.map(({ icon, id: taskId, title }) => (
                        <div key={taskId} className='flex items-center gap-4 w-full max-w-[630px]'>
                            <div className='border border-[#EFF2F6] rounded-full w-9 h-9 flex justify-center items-center'>{icon}</div>
                            <div className='grow'>{title}</div>
                            <Button
                                onClick={() => handleTask(taskId)}
                                size={"icon"}
                                variant={'outline'}
                                className='bg-[#F7F7F7]'
                                // loading={}
                                disabled={pendingTaskId === taskId && isTaskPending}
                            >
                                <SendIcon />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
            <ModelComponentWithExternalControl title="Assign Project Manager"
                onOpenChange={handleCloseModel}
                open={modelState.nameOfModel === 'assign-project-manager'}
            >
                {canAssignPM ? (
                    <AssignProjectManager onSelection={async (userId) => {
                        // Call the API to assign the project manager
                        try {
                            const payload = [{
                                userId: userId,
                                add: ['project-manager'],
                                remove: []
                            }];

                            // We need to import assignRolesToCharityAction at top of file
                            const res = await assignRolesToCharityAction(charityId, payload);

                            if (res.ok) {
                                toast.success('Project manager assigned successfully!');
                                router.refresh(); // Refresh page to show updated team
                                handleCloseModel();
                            } else {
                                toast.error(res.message || "Failed to assign project manager");
                            }
                        } catch (error) {
                            console.error(error);
                            toast.error("An unexpected error occurred");
                        }

                    }} onCancel={() => {
                        handleCloseModel()
                    }} />
                ) : null}
            </ModelComponentWithExternalControl>

            <ModelComponentWithExternalControl title="Eligibility Review" description={capitalizeWords(charityTitle)}
                onOpenChange={handleCloseModel}
                open={modelState.nameOfModel === 'eligibility'}
                dialogContentClassName='md:min-w-[700px]'
            >
                {canSubmitAudit ? (
                    <EligibilityTest
                        charityTite={charityTitle}
                        charityId={charityId}
                        onSave={() => {
                            handleCloseModel()
                            router.refresh()
                        }}
                        onCancel={handleCloseModel}
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
