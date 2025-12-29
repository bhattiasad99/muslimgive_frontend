'use client'
import React, { FC, useState, useEffect } from 'react'
import ModelComponentWithExternalControl from '@/components/common/ModelComponent/ModelComponentWithExternalControl'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { TypographyComponent } from '@/components/common/TypographyComponent'
import { Switch } from '@/components/ui/switch'

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
  const [name, setName] = useState(initial.name || '')
  const [description, setDescription] = useState(initial.description || '')

  useEffect(() => {
    if (open) {
      setName(initial?.name || '')
      setDescription(initial?.description || '')
    }
  }, [open])

  const [error, setError] = useState('')

  const [items, setItems] = useState<Permission[]>([])

  useEffect(() => {
    if (open) setItems((permissions || []).map(p => ({ ...p })))
  }, [open, permissions])

  const toggle = (id: string) => {
    setItems(prev => prev.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p))
  }

  const handleSave = () => {
    setError('')
    if (!name || name.trim() === '') {
      setError('Role name is required')
      return
    }
    onSave({ name, description, permissions: items })
    onOpenChange(false)
  }

  const handleCancel = () => {
    setName(initial.name || '')
    setDescription(initial.description || '')
    onOpenChange(false)
  }

  return (
    <ModelComponentWithExternalControl open={open} onOpenChange={onOpenChange} title={initial.name ? 'Edit Role' : 'Add new Role'} dialogContentClassName="sm:max-w-[700px]">
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
            <Button variant="primary" className="w-full" onClick={handleSave}>Save Role</Button>
          </div>
          <div className="mt-2">
            <Button variant="outline" className="w-full border-primary text-primary bg-white" onClick={handleCancel}>Cancel</Button>
          </div>
        </div>
      </div>
    </ModelComponentWithExternalControl>
  )
}

export default AddRoleModal
