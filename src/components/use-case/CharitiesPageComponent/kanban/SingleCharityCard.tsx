'use client'
import React, { FC } from 'react'
import { SingleCharityType } from './KanbanView'
import { TypographyComponent } from '@/components/common/TypographyComponent'
import { Card } from '@/components/ui/card'
import IconDropdownMenuComponent from '@/components/common/IconDropdownMenuComponent'
import ThreeDotIcon from '@/components/common/IconComponents/ThreeDotIcon'
import EmailIcon from '@/components/common/IconComponents/EmailIcon'
import OpenInNewTab from '@/components/common/IconComponents/OpenInNewTab'
import CardChatIcon from '@/components/common/IconComponents/CardChatIcon'
import DocumentIcon from '@/components/common/IconComponents/DocumentIcon'
import AvatarGroupComponent from '@/components/common/AvatarGroupComponent'
import { Button } from '@/components/ui/button'
import AssignUserIcon from '@/components/common/IconComponents/AssignUserIcon'
import LightButtonComponent from '@/components/common/LightButtonComponent'
import { useRouter } from 'next/navigation'
import ModelComponentWithExternalControl from '@/components/common/ModelComponent/ModelComponentWithExternalControl'
import { toast } from 'sonner'
import AssignProjectManager from '../../SingleCharityPageComponent/models/AssignProjectManager'
import { usePermissions } from '@/components/common/permissions-provider'
import { PERMISSIONS } from '@/lib/permissions-config'
import { assignRolesToCharityAction } from '@/app/actions/charities'

type IProps = Omit<SingleCharityType, 'category'>

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
    pendingEligibilityReason
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
    const menuOptions = [
        isAllowed({ anyOf: [PERMISSIONS.SEND_EMAIL_CHARITY_OWNER] })
            ? {
                value: 'email-logs',
                label: <div className='flex gap-1 items-center cursor-pointer' onClick={() => router.push(`/email-logs?charity=${encodeURIComponent(charityTitle)}`)}><EmailIcon color='#666E76' /><span>View Email Logs</span></div>
            }
            : null,
        {
            value: 'open-charity',
            label: <div onClick={() => {
                router.push(`/charities/${id}`)
            }} className='flex gap-1 items-center cursor-pointer'><OpenInNewTab /><span>Open Charity</span></div>
        },
    ].filter(Boolean) as { value: string; label: React.ReactNode }[];
    return (
        <Card className='p-3 flex flex-col gap-1.5 shadow-none bg-white'>
            <div className="flex flex-col gap-1 relative">
                <IconDropdownMenuComponent
                    className='absolute right-0 top-0 rotate-90 rounded-full'
                    icon={<ThreeDotIcon />}
                    options={menuOptions}
                />
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
                    <LightButtonComponent onClick={() => handleOpenModel('assign-project-manager')} className='w-fit mt-2' icon={<AssignUserIcon />}>Assign Project Manager</LightButtonComponent>
                ) : null}
            </div>
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
                <AssignProjectManager onSelection={async (userId) => {
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

                }} onCancel={() => {
                    handleCloseModel()
                }} />
            </ModelComponentWithExternalControl>
        </Card>
    )
}

export default SingleCharityCard
