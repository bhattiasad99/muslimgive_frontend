"use client"

import React, { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { saveEligibilityRulesAction } from '@/app/actions/eligibility-rules'

const CATEGORY_OPTIONS = [
    { id: 'international-relief', label: 'International Relief' },
    { id: 'local-relief', label: 'Local Relief' },
    { id: 'education', label: 'Education' },
    { id: 'masjid-community-projects', label: 'Masjid & Community Projects' },
    { id: 'health-medical-aid', label: 'Health & Medical Aid' },
    { id: 'environment-sustainability', label: 'Environment & Sustainability' },
    { id: 'advocacy-human-rights', label: 'Advocacy & Human Rights' },
    { id: 'other', label: 'Other' },
]

type EligibilityRulesSettingsProps = {
    initialRules?: {
        minYears?: number
        minRevenue?: number
        allowedCategories?: string[]
        allowNonIslamic?: boolean
    } | null
}

const EligibilityRulesSettings = ({ initialRules = null }: EligibilityRulesSettingsProps) => {
    const [baseline, setBaseline] = useState({
        minYears: Number(initialRules?.minYears ?? 2),
        minRevenue: Number(initialRules?.minRevenue ?? 500000),
        allowNonIslamic: Boolean(initialRules?.allowNonIslamic),
        allowedCategories: Array.isArray(initialRules?.allowedCategories) ? [...initialRules!.allowedCategories] : [],
    })

    const [minYears, setMinYears] = useState<number>(baseline.minYears)
    const [minRevenue, setMinRevenue] = useState<number>(baseline.minRevenue)
    const [allowNonIslamic, setAllowNonIslamic] = useState<boolean>(baseline.allowNonIslamic)
    const [allowedCategories, setAllowedCategories] = useState<string[]>(baseline.allowedCategories)
    const [isLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)

    const selectedCount = useMemo(() => allowedCategories.length, [allowedCategories])
    const isDirty = useMemo(() => {
        const baseYears = baseline.minYears
        const baseRevenue = baseline.minRevenue
        const baseNonIslamic = baseline.allowNonIslamic
        const baseCategories = baseline.allowedCategories
        if (minYears !== baseYears) return true
        if (minRevenue !== baseRevenue) return true
        if (allowNonIslamic !== baseNonIslamic) return true
        if (allowedCategories.length !== baseCategories.length) return true
        const setA = new Set(allowedCategories)
        return baseCategories.some((c) => !setA.has(c))
    }, [allowNonIslamic, allowedCategories, baseline, minRevenue, minYears])

    const toggleCategory = (id: string, checked: boolean) => {
        setAllowedCategories(prev => checked ? [...prev, id] : prev.filter(x => x !== id))
    }

    const handleConfirmSave = async () => {
        setIsSaving(true)
        try {
            const res = await saveEligibilityRulesAction({
                minYears,
                minRevenue,
                allowNonIslamic,
                allowedCategories,
            })
            if (res.ok) {
                setBaseline({
                    minYears,
                    minRevenue,
                    allowNonIslamic,
                    allowedCategories: [...allowedCategories],
                })
                toast.success('Eligibility rules saved. Deep scan started.')
            } else {
                toast.error(res.message || 'Failed to save rules.')
            }
        } catch (error) {
            console.error(error)
            toast.error('Failed to save rules.')
        } finally {
            setIsSaving(false)
            setConfirmOpen(false)
        }
    }

    return (
        <div className="flex flex-col gap-5">
            <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="min-years">Minimum years (if not requested by themselves)</Label>
                    <Input
                        id="min-years"
                        type="number"
                        min={0}
                        value={minYears}
                        onChange={(e) => setMinYears(Number(e.target.value))}
                        disabled={isLoading}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="min-revenue">Minimum annual revenue (USD)</Label>
                    <Input
                        id="min-revenue"
                        type="number"
                        min={0}
                        value={minRevenue}
                        onChange={(e) => setMinRevenue(Number(e.target.value))}
                        disabled={isLoading}
                    />
                </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                    <div className="font-medium">Allow non-Islamic charities</div>
                    <div className="text-xs text-muted-foreground">Turn on to include non-Islamic charities in eligibility.</div>
                </div>
                <Switch
                    checked={allowNonIslamic}
                    onCheckedChange={setAllowNonIslamic}
                    disabled={isLoading}
                />
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <div className="font-medium">Allowed categories</div>
                    <div className="text-xs text-muted-foreground">
                        {selectedCount} selected{selectedCount === 0 ? ' (no category restriction)' : ''}
                    </div>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                    {CATEGORY_OPTIONS.map((c) => (
                        <label key={c.id} className="flex items-center gap-2 rounded-md border p-2 text-sm">
                            <Checkbox
                                checked={allowedCategories.includes(c.id)}
                                onCheckedChange={(checked) => toggleCategory(c.id, Boolean(checked))}
                                disabled={isLoading}
                            />
                            <span>{c.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="flex justify-end">
                <Button onClick={() => setConfirmOpen(true)} disabled={isLoading || isSaving || !isDirty}>
                    {isSaving ? 'Saving...' : 'Save Rules & Run Deep Scan'}
                </Button>
            </div>

            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Run deep scan?</DialogTitle>
                        <DialogDescription>
                            This will save the new rules and trigger a deep scan for newly eligible charities.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setConfirmOpen(false)} disabled={isSaving}>
                            Cancel
                        </Button>
                        <Button onClick={handleConfirmSave} disabled={isSaving}>
                            Yes, run scan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default EligibilityRulesSettings
