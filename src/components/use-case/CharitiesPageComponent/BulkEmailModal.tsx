'use client'

import React, { FC, useMemo, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { TableComponent } from '@/components/common/TableComponent'
import { ColumnDef } from '@tanstack/react-table'
import { SingleCharityType, StatusType } from './kanban/KanbanView'
import { Checkbox } from '@/components/ui/checkbox'
import ControlledSearchBarComponent from '@/components/common/SearchBarComponent/ControlledSearchBarComponent'

export type CharityWithoutMembersAndDesc = Omit<SingleCharityType, 'members' | 'charityDesc'>

type StatusTypeCompProps = {
    status: StatusType
}

export const StatusTypeComp: FC<StatusTypeCompProps> = ({ status }) => {
    const statusColors: Record<StatusType, string> = {
        'pending-eligibility': 'bg-red-500 text-white font-normal',
        'unassigned': 'bg-pink-400 text-white font-normal',
        'open-to-review': 'bg-sky-400 text-white font-normal',
        'pending-admin-review': 'bg-blue-600 text-white font-normal',
        'approved': 'bg-green-400 text-white font-normal',
        'ineligible': 'bg-gray-800 text-white font-normal',
    }

    return (
        <div className="flex items-center justify-center">
            <span
                className={`px-2 inline-flex text-xs leading-5 rounded-full ${statusColors[status]}`}
            >
                {formatStatus(status)}
            </span>
        </div>
    )
}

type BulkEmailModalProps = {
    onClose?: () => void
    charities?: CharityWithoutMembersAndDesc[]
}

const formatStatus = (status: StatusType) => {
    const separator = String.fromCharCode(45)
    return status
        .split(separator)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
}

const BulkEmailModal: FC<BulkEmailModalProps> = ({ onClose, charities = [] }) => {
    const [queryInput, setQueryInput] = useState('')
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCharities, setSelectedCharities] = useState<string[]>([])

    const allIds = useMemo(() => charities.map(c => c.id), [charities])
    const allSelected = selectedCharities.length > 0 && selectedCharities.length === allIds.length
    const partiallySelected = selectedCharities.length > 0 && !allSelected

    useEffect(() => {
        setSelectedCharities(prev => prev.filter(id => allIds.includes(id)))
    }, [allIds])

    const selectSingleCharity = (charityId: string, checked: boolean) => {
        setSelectedCharities(prev => {
            if (checked) {
                if (prev.includes(charityId)) return prev
                return [...prev, charityId]
            }
            return prev.filter(id => id !== charityId)
        })
    }

    const cols: ColumnDef<CharityWithoutMembersAndDesc>[] = [
        {
            id: 'select',
            header: () => (
                <Checkbox
                    checked={allSelected ? true : partiallySelected ? 'indeterminate' : false}
                    onCheckedChange={checked => {
                        if (checked) {
                            setSelectedCharities(allIds)
                        } else {
                            setSelectedCharities([])
                        }
                    }}
                />
            ),
            cell: ({ row }) => {
                const charityId = row.original.id
                const isChecked = selectedCharities.includes(charityId)
                return (
                    <Checkbox
                        checked={isChecked}
                        onCheckedChange={checked => selectSingleCharity(charityId, Boolean(checked))}
                    />
                )
            },
            enableSorting: false,
            enableColumnFilter: false,
        },
        {
            accessorKey: 'charityTitle',
            header: 'Charity Name',
            cell: ({ row }) => row.original.charityTitle,
        },
        {
            accessorKey: 'status',
            header: () => (
                <div className='text-center'>Status</div>
            ),
            cell: ({ row }) => <StatusTypeComp status={row.original.status} />,
        },
        {
            accessorKey: 'charityOwnerName',
            header: () => {
                return <div className="text-center">Owner's Name</div>
            },
            cell: ({ row }) => <div className="text-center">{row.original.charityOwnerName}</div>,
        },
        {

            accessorKey: 'auditsCompleted',
            header: () => {
                return <div className="text-center">Audits Completed</div>
            },
            cell: ({ row }) => (
                <div className="text-center">{`${row.original.auditsCompleted}/4`}</div>
            ),
        },
    ]

    const audienceCopy = useMemo(() => {
        if (selectedCharities.length === 0) return 'No charities match the current filters.'
        if (selectedCharities.length === 1) return 'Email will be sent to 1 charity from the current view.'
        return `Email will be sent to ${selectedCharities.length} charities from the current view.`
    }, [selectedCharities])

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        onClose?.()
    }

    return (
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
            <div className="text-sm text-[#3A3F45] bg-[#F5F6F7] border border-[#E3E5E7] rounded-md p-3">
                {audienceCopy}
            </div>
            <div className="w-full">
                <ControlledSearchBarComponent setQuery={(query: string) => {
                    setQueryInput(query)
                }}
                    query={queryInput}
                    placeholder="Search Charities by Title or Charity Owner's Name"
                />
            </div>

            <TableComponent<CharityWithoutMembersAndDesc>
                enabledPagination={true}
                initialPageSize={5}
                pageSizeOptions={[5, 10, 15]}
                cols={cols}
                data={charities}
                onRowClick={row => {
                    const charityId = row.original.id
                    const isChecked = selectedCharities.includes(charityId)
                    selectSingleCharity(charityId, !isChecked)
                }}
            />

            <div className="mt-2">
                <div className="text-sm text-muted-foreground mb-2">{selectedCharities.length === 0 ? 'No Charity Selected' : `${selectedCharities.length} Charity Selected`}</div>

                <div className="flex flex-col gap-2 w-full">
                    <Button
                        type="submit"
                        variant={'primary'}
                        disabled={selectedCharities.length === 0}
                        className="w-full"
                    >
                        {selectedCharities.length === 0 ? <>Select Charities to Send Email</> : <>Send Email to {selectedCharities.length} Charity</>}
                    </Button>

                    <Button type="button" variant={'outline'} onClick={onClose} className="w-full">
                        Back to charities
                    </Button>
                </div>
            </div>
        </form>
    )
}

export default BulkEmailModal
