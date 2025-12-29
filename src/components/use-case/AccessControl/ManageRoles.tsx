'use client'
import React, { FC, useState } from 'react'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit, Settings, Plus } from 'lucide-react'
import AddRoleModal from './AddRoleModal'
import EditRoleModal from './EditRoleModal'
import ManagePermissionsModal from './ManagePermissionsModal'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

type Role = {
  id: string
  name: string
  description?: string
}

type Permission = {
  id: string
  name: string
  module?: string
  enabled?: boolean
}

const sampleRoles: Role[] = [
  { id: 'r1', name: 'Project Manager', description: 'Pending Eligibility Review' },
  { id: 'r2', name: 'Operations Manager', description: 'Unassigned' },
]

const defaultPermissions = [
  { id: 'p1', name: 'Create another user', enabled: true },
  { id: 'p2', name: 'Edit Role Details', enabled: true },
  { id: 'p3', name: 'Manage roles of user', enabled: true },
]

const ManageRoles: FC = () => {
  const [roles, setRoles] = useState<Role[]>(sampleRoles)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isManagePermOpen, setIsManagePermOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)

  const handleAdd = (data: { name: string; description?: string; permissions?: Permission[] }) => {
    const newRole: Role & { permissions?: Permission[] } = { id: `r${Date.now()}`, name: data.name, description: data.description, permissions: data.permissions }
    setRoles(prev => [newRole, ...prev])
  }

  const handleEditSave = (data: { id: string; name: string; description: string }) => {
    setRoles(prev => prev.map(r => r.id === data.id ? { ...r, name: data.name, description: data.description } : r))
  }

  const handleOpenEdit = (role: Role) => { setEditingRole(role); setIsEditOpen(true) }
  const handleOpenManagePerm = (role: Role) => { setEditingRole(role); setIsManagePermOpen(true) }

  return (
    <div className="p-4 bg-white rounded-lg border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Manage Roles</h3>
        <Button variant="primary" onClick={() => setIsAddOpen(true)}>
          <Plus className="h-4 w-4" />
          Create New Role
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Role Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map(r => (
            <TableRow key={r.id}>
              <TableCell className="py-4">
                <div className="flex items-center gap-3">
                  <div className="font-medium">{r.name}</div>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <Badge variant="outline" className="px-3 py-1 bg-gray-50">{r.description}</Badge>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex items-center gap-2 justify-end">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(r)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Edit Role
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => handleOpenManagePerm(r)}>
                        <Settings className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Manage Permissions
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AddRoleModal open={isAddOpen} onOpenChange={setIsAddOpen} onSave={handleAdd} permissions={defaultPermissions} />
      {editingRole && <EditRoleModal open={isEditOpen} onOpenChange={setIsEditOpen} role={{...editingRole, description: editingRole.description || ''}} onSave={handleEditSave} permissions={defaultPermissions} />}
      <ManagePermissionsModal open={isManagePermOpen} onOpenChange={setIsManagePermOpen} permissions={defaultPermissions} onSave={(p)=>{console.log('saved perms',p)}} />
    </div>
  )
}

export default ManageRoles
