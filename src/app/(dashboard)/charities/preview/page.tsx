"use client"

import React, { useMemo, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import ArrowIcon from '@/components/common/IconComponents/ArrowIcon'
import { TypographyComponent } from '@/components/common/TypographyComponent'
import { Button } from '@/components/ui/button'
import SingleCharityDetails from '@/components/use-case/SingleCharityPageComponent/SingleCharityDetails'
import { toast } from 'sonner'
import { createCharityAction } from '@/app/actions/charities'
import Can from '@/components/common/Can'
import { PERMISSIONS } from '@/lib/permissions-config'

import { SingleCharityType } from '@/components/use-case/CharitiesPageComponent/kanban/KanbanView'

const PreviewCharityPage = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const raw = searchParams.get('data')
    const [isPublishing, setIsPublishing] = useState(false)

    const parsed = useMemo(() => {
        if (!raw) return null
        try {
            return JSON.parse(decodeURIComponent(raw))
        } catch (e) {
            console.error('Failed to parse preview data', e)
            return null
        }
    }, [raw])

    const charity = useMemo((): SingleCharityType | null => {
        if (!parsed) return null
        const start = parsed.startDate ? new Date(parsed.startDate) : null
        const startYear = parsed.startYear ? Number(parsed.startYear) : null
        let totalDuration: string | undefined = undefined
        if (start && !Number.isNaN(start.getTime())) {
            const years = Math.max(1, Math.floor((Date.now() - start.getTime()) / (1000 * 60 * 60 * 24 * 365)))
            totalDuration = `${years} ${years > 1 ? 'years' : 'year'}`
        } else if (startYear) {
            const years = Math.max(1, new Date().getFullYear() - startYear)
            totalDuration = `${years} ${years > 1 ? 'years' : 'year'}`
        }

        const website = parsed.countryCode === 'united-kingdom'
            ? parsed.ukCharityCommissionUrl
            : parsed.countryCode === 'canada'
                ? parsed.caCraUrl
                : parsed.usIrsUrl

        const resolvedCategory = parsed.category === 'other'
            ? (parsed.otherCategory || 'other')
            : (parsed.category || 'education')

        return {
            id: 'preview',
            charityTitle: parsed.name || 'Untitled Charity',
            charityOwnerName: parsed.submittedByName || '-',
            charityDesc: '',
            members: [],
            comments: 0,
            auditsCompleted: 0 as const,
            status: parsed.isEligible ? 'unassigned' : 'ineligible',
            category: resolvedCategory,
            country: parsed.countryCode,
            totalDuration,
            website: website || undefined,
            isThisMuslimCharity: Boolean(parsed.isIslamic),
            doTheyPayZakat: Boolean(parsed.doesCharityGiveZakat),
        }
    }, [parsed])

    if (!parsed || !charity) {
        return (
            <div className="p-6">
                <div className="mb-4 text-2xl font-bold italic text-gray-500">Preview Mode</div>
                <div className="mb-4">No preview data provided.</div>
                <div className="flex gap-2">
                    <Button variant="outline" className="text-blue-600 border-gray-200" onClick={() => router.push(`/create-charity?data=${encodeURIComponent(JSON.stringify(parsed))}`)}>
                        <span className="mr-2"><ArrowIcon /></span>
                        <span className="text-blue-600">Back to Editing</span>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6">
            <div className="mb-4 text-2xl font-bold italic text-gray-500">Preview Mode</div>
            <div className="mb-4">
                <Button variant="outline" className="mr-2 text-blue-600 border-gray-200 flex items-center" onClick={() => router.push(`/create-charity?data=${encodeURIComponent(JSON.stringify(parsed))}`)}>
                    <span className="mr-2"><ArrowIcon /></span>
                    <span className="text-blue-600">Back to Editing</span>
                </Button>
            </div>

            <div className="flex flex-col gap-6 xl:flex-row xl:gap-[77px]">
                <div className="w-full xl:w-[675px] flex flex-col gap-4 items-start">
                    <TypographyComponent variant="h1">{charity.charityTitle}</TypographyComponent>
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
                            <TypographyComponent variant='caption' className="w-32 sm:w-[178px] text-[#666E76]">Submitted By:</TypographyComponent>
                            <TypographyComponent variant='caption'>{charity.charityOwnerName}</TypographyComponent>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 grow">
                    <div className="flex relative justify-center">
                        <TypographyComponent variant='h2' className='w-full'>Charity Information</TypographyComponent>
                    </div>
                    <SingleCharityDetails {...charity} />
                </div>
            </div>

            <div className="flex flex-col gap-3 mt-6 sm:flex-row sm:items-center sm:gap-4">
                <Can anyOf={[PERMISSIONS.CREATE_CHARITY]}>
                    <Button variant="primary" loading={isPublishing} onClick={async () => {
                        setIsPublishing(true)
                        try {
                            const resolvedCategory = parsed.category === 'other'
                                ? (parsed.otherCategory || 'other')
                                : parsed.category
                            const payload = {
                                name: parsed.name,
                                assessmentRequested: Boolean(parsed.assessmentRequested),
                                countryCode: parsed.countryCode,
                                category: resolvedCategory,
                                startDate: parsed.startDate ? new Date(parsed.startDate).toISOString().split('T')[0] : null,
                                startYear: parsed.startYear ? Number(parsed.startYear) : null,
                                ukCharityNumber: parsed.ukCharityNumber ?? null,
                                ukCharityCommissionUrl: parsed.ukCharityCommissionUrl ?? null,
                                caRegistrationNumber: parsed.caRegistrationNumber ?? null,
                                caCraUrl: parsed.caCraUrl ?? null,
                                usEin: parsed.usEin ?? null,
                                usIrsUrl: parsed.usIrsUrl ?? null,
                                ceoName: parsed.ceoName,
                                submittedByName: parsed.submittedByName,
                                submittedByEmail: parsed.submittedByEmail,
                                isIslamic: Boolean(parsed.isIslamic),
                                doesCharityGiveZakat: Boolean(parsed.doesCharityGiveZakat),
                                annualRevenue: Number(parsed.annualRevenue ?? 0),
                                isEligible: Boolean(parsed.isEligible),
                            }

                            const res = await createCharityAction(payload)
                            if (res.ok) {
                                const charityData = res.payload?.data?.data
                                const status = charityData?.status
                                const formatStatus = (status: string) => {
                                    return status
                                        .split('-')
                                        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                                        .join(' ')
                                }
                                const statusText = status ? ` with status "${formatStatus(status)}"` : ''
                                toast.success(`Charity published successfully${statusText}`)
                                router.push('/charities')
                            } else {
                                toast.error(res.message || "Failed to publish charity")
                            }
                        } catch (error) {
                            console.error(error)
                            toast.error("An unexpected error occurred")
                        } finally {
                            setIsPublishing(false)
                        }
                    }}>Publish Charity</Button>
                </Can>
                <Button variant="outline" onClick={() => router.push(`/create-charity?data=${encodeURIComponent(JSON.stringify(parsed))}`)}>Cancel</Button>
            </div>
        </div >
    )
}

export default PreviewCharityPage
