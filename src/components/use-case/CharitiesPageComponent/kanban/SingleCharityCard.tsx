'use client'
import React, { FC } from 'react'
import { SingleCharityType } from './KanbanView'
import { TypographyComponent } from '@/components/common/TypographyComponent'
import { Card } from '@/components/ui/card'
import CardChatIcon from '@/components/common/IconComponents/CardChatIcon'
import DocumentIcon from '@/components/common/IconComponents/DocumentIcon'
import AvatarGroupComponent from '@/components/common/AvatarGroupComponent'
import AssignUserIcon from '@/components/common/IconComponents/AssignUserIcon'
import LightButtonComponent from '@/components/common/LightButtonComponent'
import { useRouter } from 'next/navigation'
import ModelComponentWithExternalControl from '@/components/common/ModelComponent/ModelComponentWithExternalControl'
import { toast } from 'sonner'
import AssignProjectManager from '../../SingleCharityPageComponent/models/AssignProjectManager'
import { usePermissions } from '@/components/common/permissions-provider'
import { PERMISSIONS } from '@/lib/permissions-config'
import { assignRolesToCharityAction } from '@/app/actions/charities'
import LinkComponent from '@/components/common/LinkComponent'

type IProps = Omit<SingleCharityType, 'category'> & {
    onNavigate?: () => void
}

const SingleCharityCard: FC<IProps> = ({
    auditsCompleted,
    charityDesc,
    charityOwnerName,
    charityTitle,
    comments,
    id,
    members,
    status,
    pendingEligibilitySource,
    pendingEligibilityReason,
    onNavigate
}) => {
    const [assignPMModelOpen, setAssignPMModelOpen] = React.useState<null | string>(null)
    const handleOpenModel = (modelName: string) => {
        setAssignPMModelOpen(modelName)
    }
    const handleCloseModel = () => {
        setAssignPMModelOpen(null)
    }
    const router = useRouter()
    const { isAllowed } = usePermissions()
    const truncatedDesc =
        charityDesc.length > 100
            ? charityDesc.slice(0, 100) + '...'
            : charityDesc
    const normalizedSource = (pendingEligibilitySource || '').toLowerCase().replace(/_/g, '-')
    const isDeepScan = status === 'pending-eligibility' && normalizedSource.includes('deep')
    return (
        <>
            <LinkComponent
                to={`/charities/${id}`}
                className="block w-full text-left"
                onClick={() => onNavigate?.()}
            >
                <Card className='relative p-3 flex flex-col gap-1.5 shadow-none bg-white'>
                    <div className="flex flex-col gap-1">
                        <TypographyComponent variant='h6'>
                            {charityTitle}
                        </TypographyComponent>
                        <div className="text-[11px] text-[#000000]">{charityOwnerName}</div>
                        <div className="text-[11px] text-[#666E76] text-justify">
                            {truncatedDesc}
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[11px] text-[#666E76]">
                                Assigned MG Members ({members.length})
                            </span>
                            <div className="">
                                <AvatarGroupComponent images={[...members.map(eachMember => {
                                    return {
                                        source: eachMember.profilePicture,
                                        id: eachMember.id,
                                        fallback: ""
                                    }
                                })]} />
                            </div>
                        </div>
                        <div className="h-[1px] w-full bg-[rgba(0,0,0,0.1)]">&nbsp;</div>
                        <div className="flex items-center gap-3 text-[11px] text-[#666E76]">
                            <div className="flex items-center min-w-max gap-0.5">
                                <span>
                                    <CardChatIcon /></span><span>{comments} Comments</span>
                            </div>
                            <div className="flex items-center min-w-max gap-0.5">
                                <span><DocumentIcon /></span><span>{auditsCompleted}/4 Audits Completed</span>
                            </div>
                        </div>
                        {isDeepScan ? (
                            <div className="mt-2 rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] text-amber-900">
                                Deep scan eligibility{pendingEligibilityReason ? `: ${pendingEligibilityReason}` : ''}
                            </div>
                        ) : null}
                        {status === 'unassigned' && isAllowed({ anyOf: [PERMISSIONS.ASSIGN_PM_CHARITY] }) && !members.some(m => m.role === 'project-manager') ? (
                            <LightButtonComponent
                                onClick={(event) => {
                                    event.preventDefault()
                                    event.stopPropagation()
                                    handleOpenModel('assign-project-manager')
                                }}
                                className='mt-2 w-fit'
                                icon={<AssignUserIcon />}
                            >
                                Assign Project Manager
                            </LightButtonComponent>
                        ) : null}
                    </div>
                </Card>
            </LinkComponent>
            <ModelComponentWithExternalControl title="Assign Project Manager"
                onOpenChange={(choice: boolean) => {
                    if (!choice) {
                        handleCloseModel()
                    } else {
                        handleOpenModel('assign-project-manager')
                    }
                }}
                open={!!assignPMModelOpen}
            >
                <AssignProjectManager
                    users={members.map((member) => ({
                        id: member.id,
                        name: member.name,
                        email: null,
                    }))}
                    onSelection={async (userId) => {
                    try {
                        const payload = [{
                            userId: userId,
                            add: ['project-manager'],
                            remove: []
                        }];

                        const res = await assignRolesToCharityAction(id, payload);

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

                    }}
                    onCancel={() => {
                    handleCloseModel()
                    }}
                />
            </ModelComponentWithExternalControl>
        </>
    )
}

export default SingleCharityCard
