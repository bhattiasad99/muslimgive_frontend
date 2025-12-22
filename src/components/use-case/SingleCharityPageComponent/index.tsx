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
import OpenInNewTab from '@/components/common/IconComponents/OpenInNewTab'
import MultipleUsersIcon from '@/components/common/IconComponents/MultipleUsersIcon'
import AuditStatus from '@/components/common/IconComponents/AuditStatus'
import SingleCharityDetails from './SingleCharityDetails'
import { DUMMY_TASKS, TaskIds } from '@/DUMMY_CHARITIES'
import SendIcon from './icons/SendIcon'
import ModelComponentWithExternalControl from '@/components/common/ModelComponent/ModelComponentWithExternalControl'
import AssignProjectManager from './models/AssignProjectManager'
import EligibilityTest from './models/EligibilityTest'
import { toast } from 'sonner'
import { capitalizeWords } from '@/lib/helpers'
import { useRouteLoader } from '@/components/common/route-loader-provider'
import LinkComponent from '@/components/common/LinkComponent'

type IProps = SingleCharityType;

type ModelControl = {
    nameOfModel: null | TaskIds;
}

const SingleCharityPageComponent: FC<IProps> = ({
    charityDesc,
    charityOwnerName,
    charityTitle,
    id: charityId,
    members,
    status,
    comments,
    auditsCompleted,
    country,
    category,
    totalDuration,
    website,
    isThisMuslimCharity,
    doTheyPayZakat,
}) => {
    const router = useRouter();
    const [modelState, setModelState] = useState<ModelControl>({ nameOfModel: null });
    const { startNavigation } = useRouteLoader()
    const [isBackPending, startBackTransition] = useTransition()
    const [isTaskPending, startTaskTransition] = useTransition()
    const [pendingTaskId, setPendingTaskId] = useState<TaskIds | null>(null)

    const handleOpenModel = (nameOfModel: TaskIds) => {
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
        const resolvedCountry = country ?? 'usa'
        if (modalTaskIds.includes(taskId)) {
            handleOpenModel(taskId)
            return
        }
        setPendingTaskId(taskId)
        startNavigation()
        startTaskTransition(() => router.push(`/charities/${charityId}/audits/${taskId}?country=${resolvedCountry}`))
    }

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
                <div className="flex gap-[77px]">
                    <div className="w-[675px] flex flex-col gap-4 items-start">
                        <TypographyComponent variant='h1' className="">{charityTitle}</TypographyComponent>
                        <div className="flex flex-col gap-2">
                            <div className="flex">
                                <TypographyComponent variant='caption' className="w-[178px] text-[#666E76]">
                                    Owner&apos;s Name:
                                </TypographyComponent>
                                <TypographyComponent variant='caption' className="">
                                    {charityOwnerName}
                                </TypographyComponent>
                            </div>
                            {members.find(m => m.role === 'project-manager') ? (
                                <div className="flex">
                                    <TypographyComponent variant='caption' className="w-[178px] text-[#666E76]">Project Manager&apos;s Name:</TypographyComponent>
                                    <TypographyComponent variant='caption' className="">
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
                                options={[
                                    {
                                        value: 'manage-team',
                                        label: <div className='flex gap-1 items-center'>
                                            <MultipleUsersIcon /><span>Manage Team</span>
                                        </div>
                                    },
                                    {
                                        value: 'view-email-logs',
                                        label: <div className='flex gap-1 items-center cursor-pointer'><EmailIcon color='#666E76' /><span>View Email Logs</span></div>
                                    },
                                    {
                                        value: 'view-audit-status',
                                        label: <LinkComponent to={`/charities/${charityId}/audits`}><div className='flex gap-1 items-center cursor-pointer'><AuditStatus /><span>View Audit Status</span></div></LinkComponent>
                                    },
                                ]}
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
                    {DUMMY_TASKS.map(({ icon, id: taskId, title }) => (
                        <div key={taskId} className='flex items-center gap-4 w-[630px]'>
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
                <AssignProjectManager onSelection={() => {
                    toast.success('Project manager assigned successfully!', {
                        duration: 2000,
                        // actionButtonStyle: {
                        //     backgroundColor: '#2563EB',
                        //     color: '#FFFFFF',
                        // },
                        // action: {
                        //     label: 'Go to Charities',
                        //     onClick: () => {
                        //         console.log("clicked")
                        //     }
                        // }
                    });
                    router.push('/charities');
                    handleCloseModel();

                }} onCancel={() => {
                    handleCloseModel()
                }} />
            </ModelComponentWithExternalControl>
            <ModelComponentWithExternalControl title="Eligibility Review" description={capitalizeWords(charityTitle)}
                onOpenChange={handleCloseModel}
                open={modelState.nameOfModel === 'eligibility'}
                dialogContentClassName='md:min-w-[700px]'
            >
                <EligibilityTest
                    charityTite={charityTitle}
                    charityId={charityId}
                />
            </ModelComponentWithExternalControl>
        </div>
    )
}

export default SingleCharityPageComponent
