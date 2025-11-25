'use client'

import React, { FC, useMemo, useState } from 'react'
import { ControlledTextFieldComponent } from '@/components/common/TextFieldComponent/ControlledTextFieldComponent'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { TableComponent } from '@/components/common/TableComponent'
import { ColumnDef } from '@tanstack/react-table'
import { SingleCharityType, StatusType } from './kanban/KanbanView'
import { DUMMY_CHARITIES } from './DUMMY_CHARITIES'

export type CharityWithoutMembersAndDesc = Omit<SingleCharityType, 'members' | 'charityDesc'>

type BulkEmailModalProps = {
    recipientsCount?: number
    onClose?: () => void,
    charities?: CharityWithoutMembersAndDesc[]
}

const formatStatus = (status: StatusType) => {
    const separator = String.fromCharCode(45) // ascii for the dash in your status values
    return status
        .split(separator)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
}

export const cols: ColumnDef<CharityWithoutMembersAndDesc>[] = [
    {
        accessorKey: "charityTitle",
        header: "Charity Name",
        cell: ({ row }) => row.original.charityTitle,
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const label = formatStatus(row.original.status)
            return <span>{label}</span>
        },
    },
    {
        accessorKey: "charityOwnerName",
        header: "Owner's Name",
        cell: ({ row }) => row.original.charityOwnerName,
    },
    {
        accessorKey: "auditsCompleted",
        header: "Audit's Completed",
        cell: ({ row }) => `${row.original.auditsCompleted}/4`,
    },
]


const BulkEmailModal: FC<BulkEmailModalProps> = ({ recipientsCount = 0, onClose, charities = [] }) => {
    const [subject, setSubject] = useState('')
    const [message, setMessage] = useState('')
    const [includeOwners, setIncludeOwners] = useState(true)
    const [includeManagers, setIncludeManagers] = useState(true)

    const audienceCopy = useMemo(() => {
        if (recipientsCount === 0) return 'No charities match the current filters.'
        if (recipientsCount === 1) return 'Email will be sent to 1 charity from the current view.'
        return `Email will be sent to ${recipientsCount} charities from the current view.`
    }, [recipientsCount])

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        onClose?.()
    }

    return (
        <form className='flex flex-col gap-4' onSubmit={onSubmit}>
            <div className="text-sm text-[#3A3F45] bg-[#F5F6F7] border border-[#E3E5E7] rounded-md p-3">
                {audienceCopy}
            </div>
            <ControlledTextFieldComponent
                label='Subject'
                placeholder='Add a subject'
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                id='bulk-email-subject'
            />
            <TableComponent<CharityWithoutMembersAndDesc> cols={cols} data={charities} />
            <div className="flex flex-col gap-2">
                <Label className='text-sm' htmlFor="bulk-email-message">Message</Label>
                <textarea
                    id="bulk-email-message"
                    className='w-full min-h-[160px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                    placeholder="Write a concise update for the selected charities"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className='flex items-center justify-between rounded-md border border-[#E3E5E7] p-3 text-sm text-[#3A3F45]'>
                    <div className="flex flex-col">
                        <span>Send to Charity Owners</span>
                        <span className='text-[11px] text-[#666E76]'>Use the primary owner email</span>
                    </div>
                    <Switch checked={includeOwners} onCheckedChange={setIncludeOwners} />
                </label>
                <label className='flex items-center justify-between rounded-md border border-[#E3E5E7] p-3 text-sm text-[#3A3F45]'>
                    <div className="flex flex-col">
                        <span>Send to Project Managers</span>
                        <span className='text-[11px] text-[#666E76]'>Include assigned MG managers</span>
                    </div>
                    <Switch checked={includeManagers} onCheckedChange={setIncludeManagers} />
                </label>
            </div>

            <div className="flex justify-end gap-2">
                <Button type='button' variant={'outline'} onClick={onClose}>
                    Cancel
                </Button>
                <Button type='submit' variant={'primary'} disabled={!subject || !message || (!includeOwners && !includeManagers)}>
                    Send Email
                </Button>
            </div>
        </form>
    )
}

export default BulkEmailModal
