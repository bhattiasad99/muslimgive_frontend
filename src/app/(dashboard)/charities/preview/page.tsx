"use client"

import React, { useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import ArrowIcon from '@/components/common/IconComponents/ArrowIcon'
import { TypographyComponent } from '@/components/common/TypographyComponent'
import { Button } from '@/components/ui/button'
import LinkComponent from '@/components/common/LinkComponent'
import SingleCharityDetails from '@/components/use-case/SingleCharityPageComponent/SingleCharityDetails'

const PreviewCharityPage = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const raw = searchParams.get('data')

    const parsed = useMemo(() => {
        if (!raw) return null
        try {
            return JSON.parse(decodeURIComponent(raw))
        } catch (e) {
            console.error('Failed to parse preview data', e)
            return null
        }
    }, [raw])

    const charity = useMemo(() => {
        if (!parsed) return null
        const start = parsed.startDate ? new Date(parsed.startDate) : null
        let totalDuration: string | undefined = undefined
        if (start) {
            const years = Math.max(1, Math.floor((Date.now() - start.getTime()) / (1000 * 60 * 60 * 24 * 365)))
            totalDuration = `${years} ${years > 1 ? 'years' : 'year'}`
        }
        return {
            id: 'preview',
            charityTitle: parsed.name || 'Untitled Charity',
            charityOwnerName: parsed.ownerName || '-',
            charityDesc: parsed.description || '',
            members: [],
            comments: 0,
            auditsCompleted: 0,
            status: 'unassigned',
            category: parsed.category || undefined,
            country: undefined,
            totalDuration,
            website: parsed.website || undefined,
            isThisMuslimCharity: Boolean(parsed.isIslamic),
            doTheyPayZakat: Boolean(parsed.paysZakat),
        }
    }, [parsed])

    if (!parsed) {
        return (
            <div className="p-6">
                <div className="mb-4 text-2xl font-bold italic text-gray-500">Preview Mode</div>
                <div className="mb-4">No preview data provided.</div>
                <div className="flex gap-2">
                    <Button variant="outline" className="text-blue-600 border-gray-200" onClick={() => router.push('/create-charity')}>
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
                <Button variant="outline" className="mr-2 text-blue-600 border-gray-200 flex items-center" onClick={() => router.push('/create-charity')}>
                    <span className="mr-2"><ArrowIcon /></span>
                    <span className="text-blue-600">Back to Editing</span>
                </Button>
            </div>

            <div className="flex gap-[77px]">
                <div className="w-[675px] flex flex-col gap-4 items-start">
                    <TypographyComponent variant="h1">{charity.charityTitle}</TypographyComponent>
                    <div className="flex flex-col gap-2">
                        <div className="flex">
                            <TypographyComponent variant='caption' className="w-[178px] text-[#666E76]">Owner&apos;s Name:</TypographyComponent>
                            <TypographyComponent variant='caption'>{charity.charityOwnerName}</TypographyComponent>
                        </div>
                    </div>
                    <TypographyComponent>{charity.charityDesc}</TypographyComponent>
                </div>

                <div className="flex flex-col gap-4 grow">
                    <div className="flex relative justify-center">
                        <TypographyComponent variant='h2' className='w-full'>Charity Information</TypographyComponent>
                    </div>
                    <SingleCharityDetails {...charity} />
                </div>
            </div>

            <div className="flex items-center gap-4 mt-6">
                <Button variant="primary" onClick={() => {
                    // TODO: wire publish to backend
                    console.log('Publish charity', parsed)
                    router.push('/charities')
                }}>Publish Charity</Button>
                <Button variant="outline" onClick={() => router.push('/create-charity')}>Cancel</Button>
            </div>
        </div>
    )
}

export default PreviewCharityPage
