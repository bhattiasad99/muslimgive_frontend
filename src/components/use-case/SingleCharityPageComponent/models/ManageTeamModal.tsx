import React, { FC, useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { TypographyComponent } from '@/components/common/TypographyComponent'
import { CircleMinus, Pencil, UserPlus } from 'lucide-react'
import ControlledSearchBarComponent from '@/components/common/SearchBarComponent/ControlledSearchBarComponent'
import { TableComponent } from '@/components/common/TableComponent'
import { ColumnDef } from '@tanstack/react-table'
import { SingleCharityType } from '../../CharitiesPageComponent/kanban/KanbanView'

type Member = SingleCharityType['members'][0]

type ManageTeamModalProps = {
    members: Member[]
    onUpdate?: (members: Member[]) => void
    onCancel?: () => void
    onEdit?: (member: Member) => void
}

const ManageTeamModal: FC<ManageTeamModalProps> = ({ members = [], onUpdate, onCancel, onEdit }) => {
    const [searchQuery, setSearchQuery] = useState('')
    const [localMembers, setLocalMembers] = useState<Member[]>([
        ...members,
        {
            id: 'dummy-1',
            name: 'Ahmed Suleman',
            role: 'project-manager',
            profilePicture: null
        },
        {
            id: 'dummy-2',
            name: 'Arsalan Waheed',
            role: 'finance-auditor',
            profilePicture: null
        },
        {
            id: 'dummy-3',
            name: 'Asad Bhatti',
            role: 'admin',
            profilePicture: null
        }
    ])

    const filteredMembers = useMemo(() => {
        if (!searchQuery) return localMembers
        const lowerQuery = searchQuery.toLowerCase()
        return localMembers.filter(m =>
            m.name.toLowerCase().includes(lowerQuery) ||
            m.role.toLowerCase().includes(lowerQuery)
        )
    }, [localMembers, searchQuery])

    const cols: ColumnDef<Member>[] = [
        {
            accessorKey: 'name',
            header: () => <div className="text-center font-medium text-xs text-[#666E76]">Name</div>,
            cell: ({ row }) => (
                <div className="text-center">
                    <TypographyComponent variant="body2" className="text-[#101928] font-medium">
                        {row.original.name}
                    </TypographyComponent>
                </div>
            ),
        },
        {
            accessorKey: 'role',
            header: () => <div className="text-center font-medium text-xs text-[#666E76]">Role</div>,
            cell: ({ row }) => (
                <div className="text-center">
                    <TypographyComponent variant="body2" className="text-[#101928]">
                        {row.original.role.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </TypographyComponent>
                </div>
            ),
        },
        {
            id: 'actions',
            header: () => <div className="text-center font-medium text-xs text-[#666E76]">Actions</div>,
            cell: ({ row }) => (
                <div className="flex items-center justify-center gap-2">
                    <div className="cursor-pointer text-[#98A2B3] hover:text-red-500" onClick={() => {
                        setLocalMembers(prev => prev.filter(m => m.id !== row.original.id))
                    }}>
                        <CircleMinus size={18} />
                    </div>
                    <div className="cursor-pointer text-[#98A2B3] hover:text-[#101928]" onClick={() => onEdit?.(row.original)}>
                        <Pencil size={18} />
                    </div>
                </div>
            ),
        },
    ]

    return (
        <div className="flex flex-col gap-6">
            <div className='flex gap-2 w-full'>
                <div className="flex-grow">
                    <ControlledSearchBarComponent
                        query={searchQuery}
                        setQuery={setSearchQuery}
                        placeholder="Search Charities or Owners"
                    />
                </div>
                <Button variant='outline' size='icon' className='h-10 w-10 flex-none bg-[#F9FAFB] border-[#E4E7EC] text-[#667085]'>
                    <UserPlus size={18} />
                </Button>
            </div>

            <TableComponent<Member>
                data={filteredMembers}
                cols={cols}
                enabledPagination={true}
                initialPageSize={5}
                pageSizeOptions={[5, 10, 15]}
            />

            <div className="flex flex-col gap-3 mt-2">
                <Button
                    className="w-full bg-[#1570EF] hover:bg-[#1570EF]/90 text-white font-semibold"
                    onClick={() => onUpdate?.(localMembers)}
                >
                    Update Changes
                </Button>
                <Button
                    variant="outline"
                    className="w-full border-[#D0D5DD] text-[#344054] font-semibold"
                    onClick={onCancel}
                >
                    Back to charities
                </Button>
            </div>
        </div>
    )
}

export default ManageTeamModal
