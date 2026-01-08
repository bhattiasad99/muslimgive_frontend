'use client'
import React, { FC, useState, useEffect, useMemo } from 'react'
import ModelComponentWithExternalControl from '@/components/common/ModelComponent/ModelComponentWithExternalControl'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { TypographyComponent } from '@/components/common/TypographyComponent'
import ConfirmActionModal from '@/components/common/ConfirmActionModal'

type IProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: { id: string; name: string; description: string }
  onSave: (data: { id: string; name: string; description: string }) => void
  permissions?: { id: string; name: string; module?: string; enabled?: boolean }[]
}

const EditRoleModal: FC<IProps> = ({ open, onOpenChange, role, onSave }) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const [initialState, setInitialState] = useState({ name: '', description: '' })

  useEffect(() => {
    if (open) {
      setName(role.name)
      setDescription(role.description)
      setInitialState({ name: role.name, description: role.description })
    }
  }, [open])

  const hasChanges = useMemo(() => {
    return name !== initialState.name || description !== initialState.description
  }, [name, description, initialState])

  const handleAssignPermissions = () => {
    setError('')
    if (!name || name.trim() === '') {
      setError('Role name is required')
      return
    }
    setShowConfirm(true)
  }

  const confirmSave = () => {
    onSave({ id: role.id, name, description })
    onOpenChange(false)
  }

  const handleCancel = () => {
    setName(initialState.name)
    setDescription(initialState.description)
    onOpenChange(false)
  }

  return (
    <>
      <ModelComponentWithExternalControl 
        open={open} 
        onOpenChange={onOpenChange} 
        title="Edit Role"
        description="Update role information"
        dialogContentClassName="sm:max-w-[700px]"
      >
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
            <Button variant="primary" className="w-full" onClick={handleAssignPermissions} disabled={!hasChanges}>Assign Permissions</Button>
          </div>
          <div>
            <Button variant="outline" className="w-full border-primary text-primary bg-white" onClick={handleCancel}>Cancel</Button>
          </div>
        </div>
      </ModelComponentWithExternalControl>
      <ConfirmActionModal
        open={showConfirm}
        onOpenChange={setShowConfirm}
        onConfirm={confirmSave}
        title="Confirm Role Update"
        description="Are you sure you want to update this role?"
        confirmText="Update Role"
        cancelText="Cancel"
      />
    </>
  )
}

export default EditRoleModal
