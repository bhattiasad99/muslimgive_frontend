'use client'
import React, { FC, useState, useEffect } from 'react'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit, Settings, Plus, Trash2 } from 'lucide-react'
import AddRoleModal from './AddRoleModal'
import EditRoleModal from './EditRoleModal'
import ManagePermissionsModal from './ManagePermissionsModal'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { _get, _post, _patch } from '@/app/lib/methods'
import { deleteRoleAction } from '@/app/actions/roles'
import { toast } from 'sonner'
import Can from '@/components/common/Can'
import { PERMISSIONS } from '@/lib/permissions-config'
import { capitalizeWords } from '@/lib/helpers'
import { cn } from '@/lib/utils'

type Role = {
  id: string
  name: string
  description?: string
  permissionIds?: string[]
  rolePolicy?: string
  canEditDelete?: boolean
  canUpdatePermissions?: boolean
}

type Permission = {
  id: string
  name: string
  module?: string
  enabled?: boolean
}

const sampleRoles: Role[] = []

// will be populated from GET /roles/permissions
const defaultPermissions: Permission[] = []

const ManageRoles: FC = () => {
  const [roles, setRoles] = useState<Role[]>(sampleRoles)
  const [permissionsList, setPermissionsList] = useState<Permission[]>(defaultPermissions)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isManagePermOpen, setIsManagePermOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const r = await _get('/roles')
        if (r.ok && r.payload?.data) {
          // API shape: payload.data.data -> array
          const apiRoles: any[] = Array.isArray(r.payload.data) ? r.payload.data : (Array.isArray(r.payload.data?.data) ? r.payload.data.data : [])
          const mapped = apiRoles.map((ar: any) => ({
            id: ar.id || ar._id || String(ar._id || ar.id),
            name: ar.title || ar.name,
            description: ar.description || '',
            permissionIds: (ar.permissions || []).map((pp: any) => pp.permissionId || pp.id || pp),
            rolePolicy: ar.rolePolicy,
            canEditDelete: ar.can_edit_delete,
            canUpdatePermissions: ar.can_update_permissions
          }))
          setRoles(mapped)
        } else {
          toast.error(r.message || 'Failed to load roles')
        }

        const p = await _get('/roles/permissions')
        if (p.ok && p.payload?.data) {
          const permsArr: any[] = Array.isArray(p.payload.data) ? p.payload.data : (Array.isArray(p.payload.data?.data) ? p.payload.data.data : [])
          // normalize permissions into {id, name, module, enabled}
          const mappedPerms = permsArr.map((pp: any) => ({ id: pp.id || pp.key || pp, name: pp.label || pp.name || pp, module: pp.module, enabled: false }))
          setPermissionsList(mappedPerms)
        }
      } catch (err) {
        console.error(err)
        toast.error('Failed to load roles or permissions')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const [isAdding, setIsAdding] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const handleAdd = async (data: { name: string; description?: string; permissions?: Permission[] }) => {
    setIsAdding(true)
    try {
      const body = {
        title: data.name,
        description: data.description,
        permissions: (data.permissions || []).filter(p => p.enabled).map(p => p.id)
      }
      const res = await _post('/roles', body)
      if (res.ok) {
        // refresh roles from server to ensure consistent shape
        const listRes = await _get('/roles')
        if (listRes.ok && listRes.payload?.data) {
          const apiRoles: any[] = Array.isArray(listRes.payload.data) ? listRes.payload.data : (Array.isArray(listRes.payload.data?.data) ? listRes.payload.data.data : [])
          const mapped = apiRoles.map((ar: any) => ({
            id: ar.id || ar._id || String(ar._id || ar.id),
            name: ar.title || ar.name,
            description: ar.description || '',
            permissionIds: (ar.permissions || []).map((pp: any) => pp.permissionId || pp.id || pp),
            rolePolicy: ar.rolePolicy,
            canEditDelete: ar.can_edit_delete,
            canUpdatePermissions: ar.can_update_permissions
          }))
          setRoles(mapped)
        }
        toast.success('Role created')
        setIsAddOpen(false)
      } else {
        toast.error(res.message || 'Failed to create role')
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to create role')
    } finally {
      setIsAdding(false)
    }
  }

  const handleEditSave = async (data: { id: string; name: string; description: string }) => {
    setIsEditing(true)
    try {
      const body = { title: data.name, description: data.description }
      const res = await _patch(`/roles/${data.id}`, body)
      if (res.ok) {
        setRoles(prev => prev.map(r => r.id === data.id ? { ...r, name: data.name, description: data.description } : r))
        toast.success('Role updated')
        setIsEditOpen(false)
      } else {
        toast.error(res.message || 'Failed to update role')
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to update role')
    } finally {
      setIsEditing(false)
    }
  }

  const handleOpenEdit = (role: Role) => { setEditingRole(role); setIsEditOpen(true) }
  const handleOpenManagePerm = (role: Role) => { setEditingRole(role); setIsManagePermOpen(true) }

  const [isSaving, setIsSaving] = useState(false)

  const handleSavePermissions = async (items: Permission[]) => {
    if (!editingRole) return
    setIsSaving(true)
    try {
      const currentIds = editingRole.permissionIds || []
      const newEnabledIds = (items || []).filter(p => p.enabled).map(p => p.id)
      const toAdd = newEnabledIds.filter(id => !currentIds.includes(id))
      const toRemove = currentIds.filter(id => !newEnabledIds.includes(id))

      if (toAdd.length === 0 && toRemove.length === 0) {
        toast(`No permission changes to save`)
        setIsManagePermOpen(false)
        return
      }

      const body = { add: toAdd, remove: toRemove }
      const res = await _patch(`/roles/${editingRole.id}/permissions`, body)
      if (res.ok && res.payload?.data) {
        // backend returns updated role in payload.data.role (or similar); try to read it
        const returnedRole = res.payload.data?.role || null
        const updatedPermissionIds = returnedRole ? (returnedRole.permissions || []).map((pp: any) => pp.permissionId || pp.id || pp) : newEnabledIds
        // update local role permission ids so UI reflects saved state
        setRoles(prev => prev.map(r => r.id === editingRole.id ? { ...r, permissionIds: updatedPermissionIds } : r))
        // update editingRole in case modal remains open or reused
        setEditingRole(prev => prev ? { ...prev, permissionIds: updatedPermissionIds } : prev)
        toast.success('Permissions updated')
        setIsManagePermOpen(false)
      } else {
        toast.error(res.message || 'Failed to update permissions')
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to update permissions')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (role: Role) => {
    if (!confirm(`Are you sure you want to delete the role "${role.name}"? This action cannot be undone.`)) return

    try {
      const res = await deleteRoleAction(role.id)
      if (res.ok) {
        setRoles(prev => prev.filter(r => r.id !== role.id))
        toast.success("Role deleted successfully")
      } else {
        toast.error(res.message || "Failed to delete role")
      }
    } catch (error) {
      console.error("Failed to delete role", error)
      toast.error("An unexpected error occurred")
    }
  }

  type RolePolicy = 'custom' | 'managed' | 'system'

  const defineColor = (rolePolicy: RolePolicy) => {
    switch (rolePolicy) {
      case 'custom':
        return 'bg-blue-100 text-blue-800'
      case 'managed':
        return 'bg-green-100 text-green-800'
      case 'system':
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-4 bg-white rounded-lg border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Manage Roles</h3>
        <Can anyOf={[PERMISSIONS.ROLE_CREATE, PERMISSIONS.ROLE_MANAGE]}>
          <Button variant="primary" onClick={() => setIsAddOpen(true)}>
            <Plus className="h-4 w-4" />
            Create New Role
          </Button>
        </Can>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Role Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="w-[160px] text-center">Actions</TableHead>
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
                <Badge variant="outline" className={cn("px-3 py-1 bg-gray-50", defineColor(r.rolePolicy as RolePolicy))}>{capitalizeWords(r.rolePolicy) || '-'}</Badge>
              </TableCell>
              <TableCell className="py-4 w-[160px]">
                <div className="flex items-center gap-2 justify-center">
                  {r.canEditDelete !== false && (
                    <Can anyOf={[PERMISSIONS.ROLE_UPDATE, PERMISSIONS.ROLE_MANAGE]}>
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
                    </Can>
                  )}

                  {r.canUpdatePermissions !== false && (
                    <Can anyOf={[PERMISSIONS.ROLE_PERMISSIONS_UPDATE, PERMISSIONS.ROLE_MANAGE]}>
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
                    </Can>
                  )}

                  {r.canEditDelete !== false && (
                    <Can anyOf={[PERMISSIONS.ROLE_DELETE, PERMISSIONS.ROLE_MANAGE]}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(r)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          Delete Role
                        </TooltipContent>
                      </Tooltip>
                    </Can>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AddRoleModal open={isAddOpen} onOpenChange={setIsAddOpen} onSave={handleAdd} permissions={permissionsList} isLoading={isAdding} />
      {editingRole && <EditRoleModal open={isEditOpen} onOpenChange={setIsEditOpen} role={{ ...editingRole, description: editingRole.description || '' }} onSave={handleEditSave} permissions={permissionsList} isLoading={isEditing} />}
      {/* Pass permissions with enabled flags for the selected role so toggles reflect current state */}
      <ManagePermissionsModal
        open={isManagePermOpen}
        onOpenChange={setIsManagePermOpen}
        permissions={editingRole ? permissionsList.map(p => ({ ...p, enabled: !!editingRole.permissionIds?.includes(p.id) })) : permissionsList}
        onSave={handleSavePermissions}
        isLoading={isSaving}
      />
    </div>
  )
}

export default ManageRoles
