'use client'
import React, { FC, useState, useEffect, useMemo } from 'react'
import ModelComponentWithExternalControl from '@/components/common/ModelComponent/ModelComponentWithExternalControl'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
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
  permissions?: Permission[]
  onSave: (permissions: Permission[]) => void
  isLoading?: boolean
}

const ManagePermissionsModal: FC<IProps> = ({ open, onOpenChange, permissions = [], onSave, isLoading = false }) => {
  const [items, setItems] = useState<Permission[]>([])
  const [permSearch, setPermSearch] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const [initialPermissions, setInitialPermissions] = useState<Permission[]>([])

  useEffect(() => {
    if (open) {
      const initPerms = permissions.map(p => ({ ...p }))
      setItems(initPerms)
      setInitialPermissions(initPerms)
    } else {
      setShowConfirm(false)
    }
  }, [open])

  const hasChanges = useMemo(() => {
    return JSON.stringify(items) !== JSON.stringify(initialPermissions)
  }, [items, initialPermissions])

  const toggle = (id: string) => {
    setItems(prev => prev.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p))
  }

  const handleSave = () => {
    setShowConfirm(true)
  }

  const confirmSave = () => {
    onSave(items)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <>
      <ModelComponentWithExternalControl
        open={open}
        onOpenChange={onOpenChange}
        title="Manage Permissions"
        description="Enable or disable permissions for this role"
        dialogContentClassName="sm:max-w-[700px]"
      >
        <div className="flex flex-col gap-4">
          <Input value={permSearch} onChange={(e) => setPermSearch((e.target as HTMLInputElement).value)} placeholder="Search Permissions by Name or Module" />
          <div className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-2">
            {items.filter(p => {
              if (!permSearch) return true
              const s = permSearch.toLowerCase()
              return String(p.name || '').toLowerCase().includes(s) || String(p.module || '').toLowerCase().includes(s)
            }).map(p => (
              <div key={p.id} className="flex items-center justify-between">
                <div>{p.name}</div>
                <Switch checked={!!p.enabled} onCheckedChange={() => toggle(p.id)} />
              </div>
            ))}
          </div>

          <div className="mt-2">
            <Button variant="primary" className="w-full" onClick={handleSave} disabled={!hasChanges}>Save Role</Button>
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
        title="Confirm Permission Changes"
        description="Are you sure you want to update the permissions for this role?"
        confirmText="Save Permissions"
        cancelText="Cancel"
        isLoading={isLoading}
      />
    </>
  )
}

export default ManagePermissionsModal
