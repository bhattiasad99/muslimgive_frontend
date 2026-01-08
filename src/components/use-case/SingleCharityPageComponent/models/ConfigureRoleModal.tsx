import React, { FC, useState } from 'react'
import { Button } from '@/components/ui/button'
import { TypographyComponent } from '@/components/common/TypographyComponent'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { SingleCharityType, BaseRoles } from '../../CharitiesPageComponent/kanban/KanbanView'

type Member = SingleCharityType['members'][0]

type ConfigureRoleModalProps = {
    member: Member
    onUpdate: (role: BaseRoles) => void
    onCancel: () => void
}

const ConfigureRoleModal: FC<ConfigureRoleModalProps> = ({ member, onUpdate, onCancel }) => {
    const [selectedRole, setSelectedRole] = useState<BaseRoles>(member.role)

    return (
        <div className="flex flex-col gap-6">
            <TypographyComponent variant="body1" className="text-[#101928] font-normal">
                {member.name}
            </TypographyComponent>

            <RadioGroup value={selectedRole} onValueChange={(val) => setSelectedRole(val as BaseRoles)} className="flex flex-col gap-3">
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="project-manager" id="r1" />
                    <Label htmlFor="r1" className="font-normal text-[#101928]">Project Manager</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="admin" id="r2" />
                    <Label htmlFor="r2" className="font-normal text-[#101928]">Operations Manager</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="finance-auditor" id="r3" />
                    <Label htmlFor="r3" className="font-normal text-[#101928]">Finance Auditor</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="zakat-auditor" id="r4" />
                    <Label htmlFor="r4" className="font-normal text-[#101928]">Zakat Auditor</Label>
                </div>
            </RadioGroup>

            <div className="flex flex-col gap-3 mt-2">
                <Button
                    className="w-full bg-[#1570EF] hover:bg-[#1570EF]/90 text-white font-semibold"
                    onClick={() => onUpdate(selectedRole)}
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

export default ConfigureRoleModal
