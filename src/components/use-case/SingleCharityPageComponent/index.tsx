'use client'
import ArrowIcon from '@/components/common/IconComponents/ArrowIcon'
import { TypographyComponent } from '@/components/common/TypographyComponent'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React, { FC, useState } from 'react'
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

type IProps = SingleCharityType;

type ModelControl = {
    nameOfModel: null | TaskIds;
}

const SingleCharityPageComponent: FC<IProps> = ({
    charityDesc,
    charityOwnerName,
    charityTitle,
    id,
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

    const handleOpenModel = (nameOfModel: TaskIds) => {
        setModelState(prevState => ({ ...prevState, nameOfModel }));
    }

    const handleCloseModel = () => {
        setModelState({ nameOfModel: null });
    }

    return (
        <div className="flex flex-col gap-5">
            <div>
                <Button onClick={() => router.push('/charities')} variant="secondary" className="border-0 text-primary">
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
                                        label: <div className='flex gap-1 items-center cursor-pointer'><AuditStatus /><span>View Audit Status</span></div>
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
                    {DUMMY_TASKS.map(({ icon, id, title }) => {
                        const handleBtnClick = (nameOfBtn: TaskIds) => {
                            handleOpenModel(nameOfBtn);
                        }
                        return <div key={id} className='flex items-center gap-4 w-[630px]'>
                            <div className='border border-[#EFF2F6] rounded-full w-9 h-9 flex justify-center items-center'>{icon}</div>
                            <div className='grow'>{title}</div>
                            <Button onClick={() => {
                                const modelStates: TaskIds[] = ['assign-project-manager', 'eligibility'];
                                if (modelStates.includes(id)) {
                                    handleBtnClick(id)
                                }
                            }} size={"icon"} variant={'outline'} className='bg-[#F7F7F7]'><SendIcon /></Button>
                        </div>
                    })}
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
                    charityId={id}
                />
            </ModelComponentWithExternalControl>
        </div>
    )
}

export default SingleCharityPageComponent