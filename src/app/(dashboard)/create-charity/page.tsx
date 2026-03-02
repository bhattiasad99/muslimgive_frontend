"use client"

import React, { useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import LinkComponent from '@/components/common/LinkComponent'
import { ControlledTextFieldComponent } from '@/components/common/TextFieldComponent/ControlledTextFieldComponent'
import DatePicker from '@/components/common/ControlledDatePickerComponent'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { CategoryEnum } from '@/components/use-case/CharitiesPageComponent/kanban/KanbanView'
import CountrySelectComponent from '@/components/common/CountrySelectComponent'
import type { CountriesInKebab } from '@/components/common/CountrySelectComponent/countries.types'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import EligibilitySuggestionCard, { buildEligibilitySuggestion } from '@/components/common/EligibilitySuggestionCard'
import { LogoUploadComponent } from '@/components/common/LogoUploadComponent'
import { uploadCharityLogoAction } from '@/app/actions/charities'
import { toast } from 'sonner'
import { getCurrencySymbol, getCurrencyCode } from '@/lib/utils'

const CreateCharityStandalonePage = () => {
    const [name, setName] = useState('')
    const [logoUrl, setLogoUrl] = useState('')
    const [isUploadingLogo, setIsUploadingLogo] = useState(false)
    const [assessmentRequested, setAssessmentRequested] = useState(false)
    const [country, setCountry] = useState<CountriesInKebab | ''>('')
    const [category, setCategory] = useState<string>('')
    const [otherCategory, setOtherCategory] = useState('')

    const [startDateType, setStartDateType] = useState<'date' | 'year'>('date')
    const [startDate, setStartDate] = useState<Date | undefined>(undefined)
    const [startYear, setStartYear] = useState('')

    const [ukCharityNumber, setUkCharityNumber] = useState('')
    const [ukCharityCommissionUrl, setUkCharityCommissionUrl] = useState('')
    const [caRegistrationNumber, setCaRegistrationNumber] = useState('')
    const [caCraUrl, setCaCraUrl] = useState('')
    const [usEin, setUsEin] = useState('')
    const [usIrsUrl, setUsIrsUrl] = useState('')

    const [ceoName, setCeoName] = useState('')
    const [submittedByName, setSubmittedByName] = useState('')
    const [submittedByEmail, setSubmittedByEmail] = useState('')

    const [isIslamic, setIsIslamic] = useState<'yes' | 'no' | ''>('')
    const [paysZakat, setPaysZakat] = useState<'yes' | 'no' | ''>('')
    const [annualRevenue, setAnnualRevenue] = useState('')

    const [isEligible, setIsEligible] = useState<'yes' | 'no' | ''>('')

    const [errors, setErrors] = useState<{ [k: string]: string }>({})

    const categories = useMemo(() => Object.entries(CategoryEnum).map(([k, v]) => ({ id: k, label: v })), [])
    const eligibilitySuggestion = useMemo(() => {
        return buildEligibilitySuggestion({
            annualRevenue: annualRevenue.trim() ? Number(annualRevenue) : null,
            isIslamic: isIslamic === 'yes',
            category,
            assessmentRequested,
            startDate: startDateType === 'date' ? startDate : null,
            startYear: startDateType === 'year' ? startYear : null,
            countryCode: country,
        })
    }, [annualRevenue, isIslamic, category, assessmentRequested, startDateType, startDate, startYear, country])

    const router = useRouter()
    const searchParams = useSearchParams()

    const isUk = country === 'united-kingdom'
    const isCa = country === 'canada'
    const isUs = country === 'united-states'

    React.useEffect(() => {
        const raw = searchParams.get('data')
        if (raw) {
            try {
                const parsed = JSON.parse(decodeURIComponent(raw))
                if (parsed.name) setName(parsed.name)
                if (parsed.logoUrl) {
                    setLogoUrl(parsed.logoUrl)
                }
                if (parsed.assessmentRequested) setAssessmentRequested(Boolean(parsed.assessmentRequested))
                if (parsed.countryCode) setCountry(parsed.countryCode)
                if (parsed.category) setCategory(parsed.category)
                if (parsed.otherCategory) setOtherCategory(parsed.otherCategory)
                if (parsed.startDate) {
                    setStartDateType('date')
                    setStartDate(new Date(parsed.startDate))
                }
                if (parsed.startYear) {
                    setStartDateType('year')
                    setStartYear(String(parsed.startYear))
                }
                if (parsed.ukCharityNumber) setUkCharityNumber(parsed.ukCharityNumber)
                if (parsed.ukCharityCommissionUrl) setUkCharityCommissionUrl(parsed.ukCharityCommissionUrl)
                if (parsed.caRegistrationNumber) setCaRegistrationNumber(parsed.caRegistrationNumber)
                if (parsed.caCraUrl) setCaCraUrl(parsed.caCraUrl)
                if (parsed.usEin) setUsEin(parsed.usEin)
                if (parsed.usIrsUrl) setUsIrsUrl(parsed.usIrsUrl)
                if (parsed.ceoName) setCeoName(parsed.ceoName)
                if (parsed.submittedByName) setSubmittedByName(parsed.submittedByName)
                if (parsed.submittedByEmail) setSubmittedByEmail(parsed.submittedByEmail)
                if (parsed.isIslamic !== undefined) setIsIslamic(parsed.isIslamic ? 'yes' : 'no')
                if (parsed.doesCharityGiveZakat !== undefined) setPaysZakat(parsed.doesCharityGiveZakat ? 'yes' : 'no')
                if (parsed.annualRevenue !== undefined) setAnnualRevenue(String(parsed.annualRevenue))
                if (parsed.isEligible !== undefined) setIsEligible(parsed.isEligible ? 'yes' : 'no')
            } catch (error) {
                console.error('Failed to parse data provided', error)
            }
        }
    }, [searchParams])

    const handleLogoUpload = async (file: File) => {
        setIsUploadingLogo(true)

        try {
            const res = await uploadCharityLogoAction(file)
            if (res.ok && res.payload?.data?.url) {
                const uploadedUrl = res.payload.data.url
                setLogoUrl(uploadedUrl)
                toast.success('Logo uploaded successfully!')
            } else {
                toast.error(res.message || 'Failed to upload logo')
            }
        } catch (error) {
            console.error('Error uploading logo:', error)
            toast.error('An error occurred while uploading the logo')
        } finally {
            setIsUploadingLogo(false)
        }
    }

    const handleLogoRemove = () => {
        setLogoUrl('')
    }

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const next: { [k: string]: string } = {}
        if (!name.trim()) next.name = 'Name is required'
        if (!country) next.country = 'Country is required'
        if (!category) next.category = 'Category is required'
        if (category === 'other' && !otherCategory.trim()) next.otherCategory = 'Other category is required'

        if (startDateType === 'date') {
            if (!startDate) next.startDate = 'Start date is required'
        } else {
            if (!startYear.trim()) {
                next.startYear = 'Start year is required'
            } else if (!/^\d{4}$/.test(startYear.trim())) {
                next.startYear = 'Start year must be a 4-digit year'
            }
        }

        if (isUk) {
            if (!ukCharityNumber.trim()) next.ukCharityNumber = 'Charity number is required'
            if (!ukCharityCommissionUrl.trim()) next.ukCharityCommissionUrl = 'Charity Commission link is required'
        }
        if (isCa) {
            if (!caRegistrationNumber.trim()) next.caRegistrationNumber = 'Registration number is required'
            if (!caCraUrl.trim()) next.caCraUrl = 'CRA link is required'
        }
        if (isUs) {
            if (!usEin.trim()) next.usEin = 'EIN is required'
        }

        if (!ceoName.trim()) next.ceoName = 'CEO name is required'
        if (!submittedByName.trim()) next.submittedByName = 'Submitted by name is required'
        if (!submittedByEmail.trim()) {
            next.submittedByEmail = 'Submitted by email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submittedByEmail)) {
            next.submittedByEmail = 'Invalid email address'
        }

        if (!isIslamic) next.isIslamic = 'Is Islamic charity is required'
        if (!paysZakat) next.paysZakat = 'Zakat selection is required'

        if (!annualRevenue.trim()) {
            next.annualRevenue = 'Annual revenue is required'
        } else if (Number.isNaN(Number(annualRevenue)) || Number(annualRevenue) < 0) {
            next.annualRevenue = 'Annual revenue must be a number greater than or equal to 0'
        }

        if (!isEligible) next.isEligible = 'Eligibility selection is required'

        setErrors(next)
        if (Object.keys(next).length > 0) return

        const payload = {
            name,
            logoUrl: logoUrl || null,
            assessmentRequested,
            countryCode: country,
            category,
            otherCategory: otherCategory.trim() || null,
            startDate: startDateType === 'date' && startDate ? startDate.toISOString().split('T')[0] : null,
            startYear: startDateType === 'year' ? Number(startYear) : null,
            ukCharityNumber: isUk ? ukCharityNumber : null,
            ukCharityCommissionUrl: isUk ? ukCharityCommissionUrl : null,
            caRegistrationNumber: isCa ? caRegistrationNumber : null,
            caCraUrl: isCa ? caCraUrl : null,
            usEin: isUs ? usEin : null,
            usIrsUrl: isUs ? usIrsUrl || null : null,
            ceoName,
            submittedByName,
            submittedByEmail,
            isIslamic: isIslamic === 'yes',
            doesCharityGiveZakat: paysZakat === 'yes',
            annualRevenue: Number(annualRevenue),
            isEligible: isEligible === 'yes',
        }

        const encoded = encodeURIComponent(JSON.stringify(payload))
        router.push(`/charities/preview?data=${encoded}`)
    }

    return (
        <div className="p-6">
            <form onSubmit={onSubmit} className="flex flex-col gap-6">
                <div className="bg-white border rounded-md p-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <Label htmlFor="charity-name" className="text-sm">Name of Charity <span className="text-red-500">*</span></Label>
                            <ControlledTextFieldComponent id="charity-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="" required />
                            {errors.name ? <div className="text-xs text-red-500 mt-1">{errors.name}</div> : null}
                        </div>

                        <div className="max-w-sm">
                            <LogoUploadComponent
                                label="Charity Logo (Optional)"
                                description="Upload a logo for the charity"
                                value={logoUrl}
                                onFileUpload={handleLogoUpload}
                                onRemove={handleLogoRemove}
                                isUploading={isUploadingLogo}
                                accept={['image/png', 'image/jpeg', 'image/jpg']}
                                maxSizeBytes={5 * 1024 * 1024}
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <Checkbox id="assessment-requested" checked={assessmentRequested} onCheckedChange={(v) => setAssessmentRequested(Boolean(v))} />
                            <Label htmlFor="assessment-requested" className="text-sm">Did the charity themselves requested the assessment?</Label>
                        </div>

                        <div className="max-w-sm">
                            <Label className="text-sm">Select Country <span className="text-red-500">*</span></Label>
                            <CountrySelectComponent
                                value={country || undefined}
                                onChange={(value) => setCountry(value)}
                                allowedCountries={['united-kingdom', 'canada', 'united-states']}
                                placeholder="Select Country"
                            />
                            {errors.country ? <div className="text-xs text-red-500 mt-1">{errors.country}</div> : null}
                        </div>

                        <div className="max-w-sm">
                            <Label className="text-sm">Select the category of this charity <span className="text-red-500">*</span></Label>
                            <Select key={category} value={category} onValueChange={(v) => setCategory(v)}>
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
                        {category === 'other' ? (
                            <div className="max-w-sm">
                                <Label htmlFor="other-category" className="text-sm">Other category <span className="text-red-500">*</span></Label>
                                <ControlledTextFieldComponent
                                    id="other-category"
                                    value={otherCategory}
                                    onChange={(e) => setOtherCategory(e.target.value)}
                                    placeholder="Enter category"
                                />
                                {errors.otherCategory ? <div className="text-xs text-red-500 mt-1">{errors.otherCategory}</div> : null}
                            </div>
                        ) : null}

                        <div className="flex flex-col gap-3">
                            <Label className="text-sm">Start date or Start Year <span className="text-red-500">*</span></Label>
                            <RadioGroup value={startDateType} onValueChange={(val) => setStartDateType(val as 'date' | 'year')} className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <RadioGroupItem value="date" id="start-date" />
                                    <Label htmlFor="start-date">Exact start date</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <RadioGroupItem value="year" id="start-year" />
                                    <Label htmlFor="start-year">Start year only</Label>
                                </div>
                            </RadioGroup>
                            {startDateType === 'date' ? (
                                <div className="max-w-sm">
                                    <DatePicker value={startDate} onChange={setStartDate} disabledFutureDates={true} id="charity-startdate" />
                                    {errors.startDate ? <div className="text-xs text-red-500 mt-1">{errors.startDate}</div> : null}
                                </div>
                            ) : (
                                <div className="max-w-sm">
                                    <ControlledTextFieldComponent
                                        id="charity-startyear"
                                        value={startYear}
                                        onChange={(e) => setStartYear(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                        placeholder="2___"
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={4}
                                        pattern="\d{4}"
                                    />
                                    {errors.startYear ? <div className="text-xs text-red-500 mt-1">{errors.startYear}</div> : null}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label className="text-sm">Website <span className="text-red-500">*</span></Label>
                            {isUk ? (
                                <div className="grid grid-cols-1 gap-3 max-w-lg">
                                    <div>
                                        <Label htmlFor="uk-charity-number" className="text-sm">Charity No <span className="text-red-500">*</span></Label>
                                        <ControlledTextFieldComponent id="uk-charity-number" value={ukCharityNumber} onChange={(e) => setUkCharityNumber(e.target.value)} placeholder="" />
                                        {errors.ukCharityNumber ? <div className="text-xs text-red-500 mt-1">{errors.ukCharityNumber}</div> : null}
                                    </div>
                                    <div>
                                        <Label htmlFor="uk-charity-commission" className="text-sm">Charity Commission Website link <span className="text-red-500">*</span></Label>
                                        <ControlledTextFieldComponent id="uk-charity-commission" value={ukCharityCommissionUrl} onChange={(e) => setUkCharityCommissionUrl(e.target.value)} placeholder="https://" />
                                        {errors.ukCharityCommissionUrl ? <div className="text-xs text-red-500 mt-1">{errors.ukCharityCommissionUrl}</div> : null}
                                    </div>
                                </div>
                            ) : null}
                            {isCa ? (
                                <div className="grid grid-cols-1 gap-3 max-w-lg">
                                    <div>
                                        <Label htmlFor="ca-registration-number" className="text-sm">Registration No <span className="text-red-500">*</span></Label>
                                        <ControlledTextFieldComponent id="ca-registration-number" value={caRegistrationNumber} onChange={(e) => setCaRegistrationNumber(e.target.value)} placeholder="" />
                                        {errors.caRegistrationNumber ? <div className="text-xs text-red-500 mt-1">{errors.caRegistrationNumber}</div> : null}
                                    </div>
                                    <div>
                                        <Label htmlFor="ca-cra-link" className="text-sm">CRA Charity detail page link <span className="text-red-500">*</span></Label>
                                        <ControlledTextFieldComponent id="ca-cra-link" value={caCraUrl} onChange={(e) => setCaCraUrl(e.target.value)} placeholder="https://" />
                                        {errors.caCraUrl ? <div className="text-xs text-red-500 mt-1">{errors.caCraUrl}</div> : null}
                                    </div>
                                </div>
                            ) : null}
                            {isUs ? (
                                <div className="grid grid-cols-1 gap-3 max-w-lg">
                                    <div>
                                        <Label htmlFor="us-ein" className="text-sm">EIN number <span className="text-red-500">*</span></Label>
                                        <ControlledTextFieldComponent id="us-ein" value={usEin} onChange={(e) => setUsEin(e.target.value)} placeholder="" />
                                        {errors.usEin ? <div className="text-xs text-red-500 mt-1">{errors.usEin}</div> : null}
                                    </div>
                                    <div>
                                        <Label htmlFor="us-irs-link" className="text-sm">IRS website link (optional)</Label>
                                        <ControlledTextFieldComponent id="us-irs-link" value={usIrsUrl} onChange={(e) => setUsIrsUrl(e.target.value)} placeholder="https://" />
                                    </div>
                                </div>
                            ) : null}
                            {!isUk && !isCa && !isUs ? (
                                <div className="text-sm text-muted-foreground">Select a country to enter the website details.</div>
                            ) : null}
                        </div>

                        <div>
                            <Label htmlFor="ceo-name" className="text-sm">CEO&apos;s name <span className="text-red-500">*</span></Label>
                            <ControlledTextFieldComponent id="ceo-name" value={ceoName} onChange={(e) => setCeoName(e.target.value)} placeholder="" />
                            {errors.ceoName ? <div className="text-xs text-red-500 mt-1">{errors.ceoName}</div> : null}
                        </div>

                        <div>
                            <Label htmlFor="submitted-by-name" className="text-sm">Submitted by name <span className="text-red-500">*</span></Label>
                            <ControlledTextFieldComponent id="submitted-by-name" value={submittedByName} onChange={(e) => setSubmittedByName(e.target.value)} placeholder="" />
                            {errors.submittedByName ? <div className="text-xs text-red-500 mt-1">{errors.submittedByName}</div> : null}
                        </div>

                        <div>
                            <Label htmlFor="submitted-by-email" className="text-sm">Submitted by email <span className="text-red-500">*</span></Label>
                            <ControlledTextFieldComponent id="submitted-by-email" value={submittedByEmail} onChange={(e) => setSubmittedByEmail(e.target.value)} placeholder="" type="email" />
                            <p className="text-xs text-muted-foreground mt-1">This person will recieve emails from MuslimGive</p>
                            {errors.submittedByEmail ? <div className="text-xs text-red-500 mt-1">{errors.submittedByEmail}</div> : null}
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <Label className="text-sm">Is this an islamic charity <span className="text-red-500">*</span></Label>
                                <RadioGroup value={isIslamic} onValueChange={(val) => setIsIslamic(val as 'yes' | 'no')} className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <RadioGroupItem value="yes" id="islamic-yes" />
                                        <Label htmlFor="islamic-yes">Yes</Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <RadioGroupItem value="no" id="islamic-no" />
                                        <Label htmlFor="islamic-no">No</Label>
                                    </div>
                                </RadioGroup>
                                {errors.isIslamic ? <div className="text-xs text-red-500 mt-1">{errors.isIslamic}</div> : null}
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label className="text-sm">Do they pay zakat <span className="text-red-500">*</span></Label>
                                <RadioGroup value={paysZakat} onValueChange={(val) => setPaysZakat(val as 'yes' | 'no')} className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <RadioGroupItem value="yes" id="zakat-yes" />
                                        <Label htmlFor="zakat-yes">Yes</Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <RadioGroupItem value="no" id="zakat-no" />
                                        <Label htmlFor="zakat-no">No</Label>
                                    </div>
                                </RadioGroup>
                                {errors.paysZakat ? <div className="text-xs text-red-500 mt-1">{errors.paysZakat}</div> : null}
                            </div>
                        </div>

                        <div className="max-w-sm">
                            <Label htmlFor="annual-revenue" className="text-sm">
                                Annual revenue (in {getCurrencySymbol(country)} {getCurrencyCode(country)})
                                <span className="text-red-500">*</span>
                            </Label>
                            <ControlledTextFieldComponent id="annual-revenue" value={annualRevenue} onChange={(e) => setAnnualRevenue(e.target.value)} placeholder="" type="number" />
                            {errors.annualRevenue ? <div className="text-xs text-red-500 mt-1">{errors.annualRevenue}</div> : null}
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label className="text-sm">Is this charity eligible for review? <span className="text-red-500">*</span></Label>
                            <EligibilitySuggestionCard suggestion={eligibilitySuggestion} />
                            <RadioGroup value={isEligible} onValueChange={(val) => setIsEligible(val as 'yes' | 'no')} className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <RadioGroupItem value="yes" id="eligible-yes" />
                                    <Label htmlFor="eligible-yes">Yes</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <RadioGroupItem value="no" id="eligible-no" />
                                    <Label htmlFor="eligible-no">No</Label>
                                </div>
                            </RadioGroup>
                            {errors.isEligible ? <div className="text-xs text-red-500 mt-1">{errors.isEligible}</div> : null}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
