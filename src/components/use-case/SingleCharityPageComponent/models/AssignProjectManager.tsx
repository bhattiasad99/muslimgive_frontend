import * as React from "react"
import { AutoCompleteComponent, AutoCompleteOption } from "@/components/common/AutoCompleteComponent"
import { Label } from "@/components/ui/label"
import { TypographyComponent } from "@/components/common/TypographyComponent"
import { Button } from "@/components/ui/button"
import AvatarComponent from "@/components/common/AvatarComponent"

const projectManagers: AutoCompleteOption[] = [
    { value: "fatima-ali", label: "Fatima Ali", hint: "fatima.ali@muslimgive.org" },
    { value: "imran-khan", label: "Imran Khan", hint: "imran.khan@muslimgive.org" },
    { value: "aisha-yusuf", label: "Aisha Yusuf", hint: "aisha.yusuf@muslimgive.org" },
    { value: "hamza-ahmed", label: "Hamza Ahmed", hint: "hamza.ahmed@muslimgive.org" },
]

type IProps = {
    onSelection: (id: string) => void;
    onCancel?: () => void;
}

const AssignProjectManager: React.FC<IProps> = ({ onSelection, onCancel }) => {
    const [selectedManager, setSelectedManager] = React.useState<string | null>(null)

    return (
        <div className="max-w-md flex flex-col gap-4">
            <Label className="text-sm font-medium">Assign project manager</Label>
            <AutoCompleteComponent
                options={projectManagers}
                value={selectedManager}
                onValueChange={setSelectedManager}
                placeholder="Search managers..."
                inputPlaceholder="Type a name or email"
                emptyMessage="No managers found."
            />
            {selectedManager ? <>
                <div className="flex items-center gap-3 p-3 border rounded-md">
                    <AvatarComponent fallback="AB" sizePx={40} className="w-10 h-10 mr-3" />
                    <div className="flex flex-col">
                        <TypographyComponent className="text-gray-900 font-medium">{projectManagers.find(pm => pm.value === selectedManager)?.label}</TypographyComponent>
                        <TypographyComponent className="text-gray-600 text-xs">
                            {projectManagers.find(pm => pm.value === selectedManager)?.hint}
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
