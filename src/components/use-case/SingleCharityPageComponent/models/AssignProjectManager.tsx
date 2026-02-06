import * as React from "react"
import { AutoCompleteComponent, AutoCompleteOption } from "@/components/common/AutoCompleteComponent"
import { Label } from "@/components/ui/label"
import { TypographyComponent } from "@/components/common/TypographyComponent"
import { Button } from "@/components/ui/button"
import AvatarComponent from "@/components/common/AvatarComponent"

type IProps = {
    onSelection: (id: string) => void;
    onCancel?: () => void;
    roleLabel?: string;
    actionLabel?: string;
    users: Array<{ id: string; name: string; email?: string | null }>;
}

const AssignProjectManager: React.FC<IProps> = ({
    onSelection,
    onCancel,
    roleLabel = 'project manager',
    actionLabel = 'Assign Project Manager',
    users,
}) => {
    const [selectedManager, setSelectedManager] = React.useState<string | null>(null)
    const [searchQuery, setSearchQuery] = React.useState("")
    const options = React.useMemo<AutoCompleteOption[]>(() => {
        const lower = searchQuery.trim().toLowerCase()
        return users
            .filter(u => {
                if (!lower) return true
                return u.name.toLowerCase().includes(lower) || (u.email ?? '').toLowerCase().includes(lower)
            })
            .map(u => ({
                value: u.id,
                label: u.name,
                hint: u.email ?? undefined,
            }))
    }, [users, searchQuery])

    const selectedUserOption = options.find(opt => opt.value === selectedManager)

    return (
        <div className="max-w-md flex flex-col gap-4">
            <Label className="text-sm font-medium">{`Assign ${roleLabel}`}</Label>
            <AutoCompleteComponent
                options={options}
                value={selectedManager}
                onValueChange={setSelectedManager}
                placeholder={`Search ${roleLabel}s...`}
                inputPlaceholder="Type a name or email"
                emptyMessage={`No ${roleLabel}s found.`}
                onSearchChange={setSearchQuery}
            />
            {selectedManager && selectedUserOption ? <>
                <div className="flex items-center gap-3 p-3 border rounded-md">
                    <AvatarComponent fallback={selectedUserOption.label.charAt(0)} sizePx={40} className="w-10 h-10 mr-3" />
                    <div className="flex flex-col">
                        <TypographyComponent className="text-gray-900 font-medium">{selectedUserOption.label}</TypographyComponent>
                        <TypographyComponent className="text-gray-600 text-xs">
                            {selectedUserOption.hint}
                        </TypographyComponent>
                    </div>
                </div>
            </> : <TypographyComponent className="text-gray-800 text-xs">{`Please select a ${roleLabel}.`}</TypographyComponent>}
            <Button className="w-full" variant={"primary"} disabled={!selectedManager} onClick={() => {
                if (selectedManager)
                    onSelection(selectedManager)
            }}>{actionLabel}</Button>
            <Button className="w-full" variant={"outline"} onClick={onCancel}>Cancel</Button>
        </div>
    )
}

export default AssignProjectManager
