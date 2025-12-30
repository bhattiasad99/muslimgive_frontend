'use client'
import React, { FC, useState, useEffect, useMemo } from 'react'
import ModelComponentWithExternalControl from '@/components/common/ModelComponent/ModelComponentWithExternalControl'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { TypographyComponent } from '@/components/common/TypographyComponent'
import { Switch } from '@/components/ui/switch'
import ConfirmActionModal from '@/components/common/ConfirmActionModal'

type Permission = {
  id: string
  name: string
  module?: string
  enabled?: boolean
}

type IProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: { name: string; description: string; permissions?: Permission[] }) => void
  initial?: { name?: string; description?: string }
  permissions?: Permission[]
}

const AddRoleModal: FC<IProps> = ({ open, onOpenChange, onSave, initial = {}, permissions = [] }) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [items, setItems] = useState<Permission[]>([])
  const [showConfirm, setShowConfirm] = useState(false)
  const [initialState, setInitialState] = useState({ name: '', description: '', permissions: [] as Permission[] })

  useEffect(() => {
    if (open) {
      const initName = initial?.name || ''
      const initDesc = initial?.description || ''
      const initPerms = (permissions || []).map(p => ({ ...p }))
      
      setName(initName)
      setDescription(initDesc)
      setItems(initPerms)
      setInitialState({ name: initName, description: initDesc, permissions: initPerms })
    }
  }, [open])

  const hasChanges = useMemo(() => {
    const nameChanged = name !== initialState.name
    const descChanged = description !== initialState.description
    const permChanged = JSON.stringify(items) !== JSON.stringify(initialState.permissions)
    return nameChanged || descChanged || permChanged
  }, [name, description, items, initialState])

  const toggle = (id: string) => {
    setItems(prev => prev.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p))
  }

  const handleSave = () => {
    setError('')
    if (!name || name.trim() === '') {
      setError('Role name is required')
      return
    }
    setShowConfirm(true)
  }

  const confirmSave = () => {
    onSave({ name, description, permissions: items })
    onOpenChange(false)
  }

  const handleCancel = () => {
    setName(initialState.name)
    setDescription(initialState.description)
    setItems([...initialState.permissions])
    onOpenChange(false)
  }

  return (
    <>
      <ModelComponentWithExternalControl 
        open={open} 
        onOpenChange={onOpenChange} 
        title={initial.name ? 'Edit Role' : 'Add new Role'}
        description={initial.name ? 'Update role information and permissions' : 'Create a new role with custom permissions'}
        dialogContentClassName="sm:max-w-[700px]"
      >
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <Label className="text-sm">Name of Role</Label>
            </div>
            <div className="col-span-2">
              <Input autoFocus name="roleName" tabIndex={0} value={name} onChange={(e) => setName(e.target.value)} placeholder="Role name" className="w-full" />
              {error ? <TypographyComponent className="text-red-500 text-sm mt-1">{error}</TypographyComponent> : null}
            </div>

            <div className="col-span-1">
              <Label className="text-sm">Description</Label>
            </div>
            <div className="col-span-2">
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-md border px-3 py-2 min-h-[120px]" />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mt-4">Assign Permissions</h3>
            <div className="mt-2">
              <Input placeholder="Search Permissions by Name or Module" />
            </div>

            <div className="flex flex-col gap-3 mt-3">
              {items.map(p => (
                <div key={p.id} className="flex items-center justify-between">
                  <div>{p.name}</div>
                  <Switch checked={!!p.enabled} onCheckedChange={() => toggle(p.id)} />
                </div>
              ))}
            </div>

            <div className="mt-4">
              <Button variant="primary" className="w-full" onClick={handleSave} disabled={!hasChanges}>Save Role</Button>
            </div>
            <div className="mt-2">
              <Button variant="outline" className="w-full border-primary text-primary bg-white" onClick={handleCancel}>Cancel</Button>
            </div>
          </div>
        </div>
      </ModelComponentWithExternalControl>
      <ConfirmActionModal
        open={showConfirm}
        onOpenChange={setShowConfirm}
        onConfirm={confirmSave}
        title="Confirm Save Role"
        description={`Are you sure you want to ${initial.name ? 'update' : 'create'} this role?`}
        confirmText={initial.name ? 'Update Role' : 'Create Role'}
        cancelText="Cancel"
      />
    </>
  )
}

export default AddRoleModal
