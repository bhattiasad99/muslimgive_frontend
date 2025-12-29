'use client'
import React, { FC, useState, useEffect } from 'react'
import ModelComponentWithExternalControl from '@/components/common/ModelComponent/ModelComponentWithExternalControl'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

type Permission = {
  id: string
  name: string
  module?: string
  enabled?: boolean
}

type IProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  permissions?: Permission[]
  onSave: (permissions: Permission[]) => void
}

const ManagePermissionsModal: FC<IProps> = ({ open, onOpenChange, permissions = [], onSave }) => {
  const [items, setItems] = useState<Permission[]>([])

  useEffect(() => {
    if (open) setItems(permissions.map(p => ({ ...p })))
  }, [open, permissions])

  const toggle = (id: string) => {
    setItems(prev => prev.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p))
  }

  const handleSave = () => {
    onSave(items)
    onOpenChange(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <ModelComponentWithExternalControl open={open} onOpenChange={onOpenChange} title="Manage Permissions" dialogContentClassName="sm:max-w-[700px]">
      <div className="flex flex-col gap-4">
        <Input placeholder="Search Permissions by Name or Module" />
        <div className="flex flex-col gap-3">
          {items.map(p => (
            <div key={p.id} className="flex items-center justify-between">
              <div>{p.name}</div>
              <Switch checked={!!p.enabled} onCheckedChange={() => toggle(p.id)} />
            </div>
          ))}
        </div>

        <div className="mt-2">
          <Button variant="primary" className="w-full" onClick={handleSave}>Save Role</Button>
        </div>
        <div>
          <Button variant="outline" className="w-full border-primary text-primary bg-white" onClick={handleCancel}>Cancel</Button>
        </div>
      </div>
    </ModelComponentWithExternalControl>
  )
}

export default ManagePermissionsModal
