import React, { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import EligibilitySuggestionCard, { buildEligibilitySuggestion, type EligibilitySuggestionInput } from '@/components/common/EligibilitySuggestionCard'
import { updateCharityEligibilityAction } from '@/app/actions/charities'
import { toast } from 'sonner'

type Props = {
    charityId: string
    charityTitle: string
    suggestionInput: EligibilitySuggestionInput
    onCancel: () => void
    onUpdated: () => void
}

const EligibilityOverrideModal: React.FC<Props> = ({ charityId, charityTitle, suggestionInput, onCancel, onUpdated }) => {
    const suggestion = useMemo(() => buildEligibilitySuggestion(suggestionInput), [suggestionInput])
    const [decision, setDecision] = useState<'yes' | 'no' | ''>('')
    const [isSaving, setIsSaving] = useState(false)

    const handleOverride = async () => {
        if (decision !== 'yes') {
            toast.error('Select "Yes" to override eligibility.')
            return
        }
        setIsSaving(true)
        try {
            const res = await updateCharityEligibilityAction(charityId, { isEligible: true })
            if (res.ok) {
                toast.success('Eligibility overridden. Charity is now unassigned.')
                onUpdated()
            } else {
                toast.error(res.message || 'Failed to override eligibility.')
            }
        } catch (error) {
            console.error(error)
            toast.error('An unexpected error occurred.')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="text-sm text-muted-foreground">
                You are overriding eligibility for <span className="font-medium text-foreground">{charityTitle}</span>.
            </div>
            <EligibilitySuggestionCard suggestion={suggestion} />
            <div className="flex flex-col gap-2">
                <Label className="text-sm">Mark this charity as eligible?</Label>
                <RadioGroup value={decision} onValueChange={(val) => setDecision(val as 'yes' | 'no')}>
                    <div className="flex items-center gap-2">
                        <RadioGroupItem value="yes" id="override-yes" />
                        <Label htmlFor="override-yes">Yes (Override to eligible)</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <RadioGroupItem value="no" id="override-no" />
                        <Label htmlFor="override-no">No (Keep ineligible)</Label>
                    </div>
                </RadioGroup>
            </div>
            <div className="flex items-center justify-end gap-2">
                <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button>
                <Button variant="primary" type="button" onClick={handleOverride} disabled={isSaving}>
                    {isSaving ? 'Overriding...' : 'Override Eligibility'}
                </Button>
            </div>
        </div>
    )
}

export default EligibilityOverrideModal
