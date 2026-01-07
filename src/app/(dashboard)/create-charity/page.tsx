"use client"

import React, { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import LinkComponent from '@/components/common/LinkComponent'
import { ControlledTextFieldComponent } from '@/components/common/TextFieldComponent/ControlledTextFieldComponent'
import { TextAreaComponent } from '@/components/common/TextAreaComponent'
import DatePicker from '@/components/common/ControlledDatePickerComponent'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { CategoryEnum } from '@/components/use-case/CharitiesPageComponent/kanban/KanbanView'

const CreateCharityStandalonePage = () => {
    const [name, setName] = useState('')
    const [isIslamic, setIsIslamic] = useState(false)
    const [paysZakat, setPaysZakat] = useState(false)
    const [description, setDescription] = useState('')
    const [website, setWebsite] = useState('')
    const [startDate, setStartDate] = useState<Date | undefined>(undefined)
    const [category, setCategory] = useState<string>('')
    const [country, setCountry] = useState<string>('')
    const [errors, setErrors] = useState<{ [k: string]: string }>({})

    const categories = useMemo(() => Object.entries(CategoryEnum).map(([k, v]) => ({ id: k, label: v })), [])

    const router = useRouter()

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const next: { [k: string]: string } = {}
        if (!name.trim()) next.name = 'Name is required'
        if (!website.trim()) next.website = 'Website link is required'
        if (!startDate) next.startDate = 'Start date is required'
        if (!category) next.category = 'Category is required'
        if (!country) next.country = 'Country is required'

        setErrors(next)
        if (Object.keys(next).length > 0) return

        const payload = {
            name,
            isIslamic,
            doesCharityGiveZakat: paysZakat,
            description,
            charityCommissionWebsiteUrl: website,
            startDate: startDate ? startDate.toISOString().split('T')[0] : null,
            category,
            countryCode: country,
        }

        const encoded = encodeURIComponent(JSON.stringify(payload))
        router.push(`/charities/preview?data=${encoded}`)
    }

    return (
        <div className="p-6">
            {/* <div className="mb-6">
                <h1 className="text-3xl font-semibold">Create New Charity</h1>
            </div> */}

            <form onSubmit={onSubmit} className="flex flex-col gap-6">
                <div className="bg-white border rounded-md p-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <Label htmlFor="charity-name" className="text-sm">Name of Charity <span className="text-red-500">*</span></Label>
                            <ControlledTextFieldComponent id="charity-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="" required />
                            {errors.name ? <div className="text-xs text-red-500 mt-1">{errors.name}</div> : null}
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                                <Checkbox id="is-islamic" checked={isIslamic} onCheckedChange={(v) => setIsIslamic(Boolean(v))} />
                                <Label htmlFor="is-islamic" className="text-sm">Is this an Islamic Charity?</Label>
                            </div>

                            <div className="flex items-center gap-3">
                                <Checkbox id="pays-zakat" checked={paysZakat} onCheckedChange={(v) => setPaysZakat(Boolean(v))} />
                                <Label htmlFor="pays-zakat" className="text-sm">Does this charity give zakat?</Label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white border rounded-md p-4">
                    <TextAreaComponent label="Description" value={description} onChange={(e) => setDescription(e.target.value)} lines={6} />
                </div>

                <div className="bg-white border rounded-md p-4 grid grid-cols-1 gap-4">
                    <div>
                        <Label htmlFor="charity-website" className="text-sm">Enter Charity Commission Website Link <span className="text-red-500">*</span></Label>
                        <ControlledTextFieldComponent id="charity-website" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://" required />
                        {errors.website ? <div className="text-xs text-red-500 mt-1">{errors.website}</div> : null}
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="max-w-sm">
                            <Label htmlFor="charity-startdate" className="text-sm">Select Start Date of this charity <span className="text-red-500">*</span></Label>
                            <DatePicker value={startDate} onChange={setStartDate} disabledFutureDates={true} id="charity-startdate" />
                            {errors.startDate ? <div className="text-xs text-red-500 mt-1">{errors.startDate}</div> : null}
                        </div>

                        <div className="max-w-sm">
                            <Label className="text-sm">Select Country <span className="text-red-500">*</span></Label>
                            <Select value={country} onValueChange={(v) => setCountry(v)}>
                                <SelectTrigger className="h-9 w-full">
                                    <SelectValue placeholder="Select Country" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="usa">United States</SelectItem>
                                    <SelectItem value="uk">United Kingdom</SelectItem>
                                    <SelectItem value="canada">Canada</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.country ? <div className="text-xs text-red-500 mt-1">{errors.country}</div> : null}
                        </div>

                        <div className="max-w-sm">
                            <Label className="text-sm">Select the category of this charity <span className="text-red-500">*</span></Label>
                            <Select value={category} onValueChange={(v) => setCategory(v)}>
                                <SelectTrigger className="h-9 w-full">
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((c) => (
                                        <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.category ? <div className="text-xs text-red-500 mt-1">{errors.category}</div> : null}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Button variant="primary" type="submit">Preview Charity</Button>
                    <LinkComponent to="/charities">
                        <Button variant="outline" type="button">Cancel</Button>
                    </LinkComponent>
                </div>
            </form>
        </div>
    )
}

export default CreateCharityStandalonePage
