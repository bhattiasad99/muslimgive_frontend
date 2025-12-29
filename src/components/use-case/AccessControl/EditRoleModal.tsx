'use client'
import React, { FC, useState, useEffect } from 'react'
import ModelComponentWithExternalControl from '@/components/common/ModelComponent/ModelComponentWithExternalControl'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { TypographyComponent } from '@/components/common/TypographyComponent'

type IProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: { id: string; name: string; description: string }
  onSave: (data: { id: string; name: string; description: string }) => void
  permissions?: { id: string; name: string; module?: string; enabled?: boolean }[]
}

const EditRoleModal: FC<IProps> = ({ open, onOpenChange, role, onSave }) => {
  const [name, setName] = useState(role.name)
  const [description, setDescription] = useState(role.description)

  useEffect(() => {
    if (open) {
      setName(role.name)
      setDescription(role.description)
    }
  }, [open, role.name, role.description])

  const [error, setError] = useState('')

  const handleAssignPermissions = () => {
    setError('')
    if (!name || name.trim() === '') {
      setError('Role name is required')
      return
    }
    onSave({ id: role.id, name, description })
    onOpenChange(false)
  }

  const handleCancel = () => {
    setName(role.name)
    setDescription(role.description)
    onOpenChange(false)
  }

  return (
    <ModelComponentWithExternalControl open={open} onOpenChange={onOpenChange} title="Edit Role" dialogContentClassName="sm:max-w-[700px]">
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

        <div className="mt-2">
          <Button variant="primary" className="w-full" onClick={handleAssignPermissions}>Assign Permissions</Button>
        </div>
        <div>
          <Button variant="outline" className="w-full border-primary text-primary bg-white" onClick={handleCancel}>Cancel</Button>
        </div>
      </div>
    </ModelComponentWithExternalControl>
  )
}

export default EditRoleModal
