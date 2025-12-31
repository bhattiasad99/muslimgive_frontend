import * as React from "react"
import { AutoCompleteComponent, AutoCompleteOption } from "@/components/common/AutoCompleteComponent"
import { Label } from "@/components/ui/label"
import { TypographyComponent } from "@/components/common/TypographyComponent"
import { Button } from "@/components/ui/button"
import AvatarComponent from "@/components/common/AvatarComponent"
import { listUsersAction } from "@/app/actions/users"
import { toast } from "sonner"
import { useDebounce } from "@/hooks/useDebounce"

type IProps = {
    onSelection: (id: string) => void;
    onCancel?: () => void;
}

const AssignProjectManager: React.FC<IProps> = ({ onSelection, onCancel }) => {
    const [selectedManager, setSelectedManager] = React.useState<string | null>(null)
    const [searchQuery, setSearchQuery] = React.useState("")
    const debouncedSearch = useDebounce(searchQuery, 300)
    const [options, setOptions] = React.useState<AutoCompleteOption[]>([])
    const [loading, setLoading] = React.useState(false)

    React.useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true)
            try {
                // Fetching all users or filtering by search if provided
                // Ideally, backend should support role filtering like 'project-manager'
                const res = await listUsersAction({
                    search: debouncedSearch,
                    limit: 50
                })

                if (res.ok && Array.isArray(res.payload?.data)) {
                    const users = res.payload.data;
                    const managerOptions: AutoCompleteOption[] = users.map((u: any) => ({
                        value: u.id,
                        label: `${u.firstName} ${u.lastName}`,
                        hint: u.email
                    }))
                    setOptions(managerOptions)
                }
            } catch (error) {
                console.error("Failed to fetch users", error)
                toast.error("Failed to load project managers")
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [debouncedSearch])

    const selectedUserOption = options.find(opt => opt.value === selectedManager)

    return (
        <div className="max-w-md flex flex-col gap-4">
            <Label className="text-sm font-medium">Assign project manager</Label>
            <AutoCompleteComponent
                options={options}
                value={selectedManager}
                onValueChange={setSelectedManager}
                placeholder={loading ? "Loading..." : "Search managers..."}
                inputPlaceholder="Type a name or email"
                emptyMessage="No managers found."
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
            </> : <TypographyComponent className="text-gray-800 text-xs">Please select a project manager.</TypographyComponent>}
            <Button className="w-full" variant={"primary"} disabled={!selectedManager} onClick={() => {
                if (selectedManager)
                    onSelection(selectedManager)
            }}>Assign Project Manager</Button>
            <Button className="w-full" variant={"outline"} onClick={onCancel}>Cancel</Button>
        </div>
    )
}

export default AssignProjectManager
